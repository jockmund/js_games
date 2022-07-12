export default class EventEmitter {
    events = {}

    on(eventName, fn) {
        if (!this.events[eventName]) {
            this.events[eventName] = []
        }

        this.events[eventName].push(fn)
    }

    emit(eventName, data) {
        if (!this.events[eventName])
            return

        this.events[eventName].forEach(event => {
            event.call(null, data)
        })
    }

    unsubscribe(eventName, fn) {
        if (!this.events[eventName])
            return

        this.events[eventName].filter(event => event !== fn)
    }
}