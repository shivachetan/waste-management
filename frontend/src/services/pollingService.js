// Polling service for real-time updates

export class PollingService {
  constructor() {
    this.polls = {}
  }

  // Start polling an endpoint
  startPolling(key, fn, interval = 10000) {
    if (this.polls[key]) {
      clearInterval(this.polls[key])
    }

    // Call immediately
    fn()

    // Then set interval
    this.polls[key] = setInterval(fn, interval)
  }

  // Stop polling
  stopPolling(key) {
    if (this.polls[key]) {
      clearInterval(this.polls[key])
      delete this.polls[key]
    }
  }

  // Stop all polling
  stopAll() {
    Object.keys(this.polls).forEach(key => {
      clearInterval(this.polls[key])
    })
    this.polls = {}
  }
}

export const pollingService = new PollingService()
