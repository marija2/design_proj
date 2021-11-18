class Comment {
    constructor(comment, student_first_name = "", student_last_name = "", student_username = "") {
        this.comment = comment
        this.student_first_name = student_first_name
        this.student_last_name = student_last_name
        this.student_username = student_username
    }

    setStudent(student) {
        this.student_first_name = student.first_name
        this.student_last_name = student.last_name
        this.student_username = student.username
    }
}

export default Comment;