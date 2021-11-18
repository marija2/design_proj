class Post {
    constructor(post, student_first_name = "", student_last_name = "", student_username = "") {
        this.post = post
        this.comments = []
        this.student_first_name = student_first_name
        this.student_last_name = student_last_name
        this.student_username = student_username
        this.student_id = post.student_id
        this.section_name = ""
        this.section_code = ""
    }

    setStudent(student) {
        this.student_first_name = student.first_name
        this.student_last_name = student.last_name
        this.student_username = student.username
    }

    setSection(section) {
        this.section_name = section.section_name
        this.section_code = section.code
    }
}

export default Post;