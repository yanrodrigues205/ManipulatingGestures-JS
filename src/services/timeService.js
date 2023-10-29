
  function prepareRunChecker({ timerDelay }) {
    let lastEvent = Date.now()
    return {
      shouldRun() {
        const result = (Date.now() - lastEvent) > timerDelay
        if(result) lastEvent = Date.now()
  
        return result
      }
    }
  }
  
  export {
    prepareRunChecker
  }