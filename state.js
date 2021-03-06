/* 
 *
StateMachine
  	shameless crib of wizardmaster's simple state machine

	example:
 // create it:
  stateMachine = new StateMachine({
    start:{
      enterState:function(){
        console.log("START");
      },
      searchButtonClick:function(){
        stateMachine.transition("searching");
      },
    },
    searching:{
      enterState:function(){
        console.log("SEARCHING");
      },
      exitState:function(){
        console.log("not searching");
      },
      searchButtonClick:function(){
        stateMachine.transition("paused");
      },
      cancelButtonClick:function(){
        stateMachine.transition("start");
      },
    },
    paused:{
      enterState:function(){
        console.log("PAUSED");
      },
      searchButtonClick:function(){
        stateMachine.transition("searching");
      },
      cancelButtonClick:function(){
        stateMachine.transition("start");
      },
    }
  }, "start");

  // use it:
  stateMachine.event("searchButtonClick");
  stateMachine.event("cancelButtonClick");

*
*/

//----------------------------------------------------- 
function StateMachine(handlers, startState, _context){
  this._handlers = handlers;
  this._context = _context;
  this.transition(startState);
}
//----------------------------------------------------- 
StateMachine.prototype.event = function(eventName, _eventData){
  console.log("event "+eventName);
  _eventData && console.log("_eventData.key: " + _eventData.key + " _eventData.value: " + _eventData.value);
  var handler = this._getHandler(eventName);
  if(handler) handler.call(this._context, _eventData);
}
//----------------------------------------------------- 
StateMachine.prototype.transition = function(newState){
  // Exit previous state
  if(this._currentState) console.log("exit state "+this._currentState);
  var handler = this._getHandler("exitState");
  if(handler) handler.call(this._context);
  
  // Set state
  this._currentState = newState;
  
  // Enter new state
  console.log("enter state "+this._currentState);
  var handler = this._getHandler("enterState");
  if(handler) handler.call(this._context);
}
//----------------------------------------------------- 
// Return the current state handler for the event
// or if there isn't one and there is a base state handler
// defined, return the base state handler
StateMachine.prototype._getHandler = function(eventName){
  if(!this._currentState) return;
  var stateHandler = this._handlers[this._currentState];
  if(stateHandler && stateHandler[eventName]) return stateHandler[eventName];
  else if(this._handlers.base) return this._handlers.base[eventName];
}

