class CurrentUser {
    constructor() {
        this.first_name = "";
    }

    startSession(first_name) {
        this.first_name = first_name;
    }

    stopSession() {
        this.first_name = "";
    }

    getName() {
        return this.first_name;
    }
}

var currentUser = new CurrentUser();

export default currentUser;