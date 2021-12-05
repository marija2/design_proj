import React from "react";
import postRequest from "./PostRequest"
import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';
import { FaRegCommentDots } from 'react-icons/fa'
import { FaRegHeart } from 'react-icons/fa'

import "./Profile.css"

class PostRender extends React.Component {
    constructor(props) {
        super(props)

        this.handleLike = this.handleLike.bind(this);
        this.handleComment = this.handleComment.bind(this);
        this.flipSeeComments = this.flipSeeComments.bind(this);

        this.state = {
            post: props.post,
            comments: props.comments,
            student_first_name: props.student_first_name,
            student_last_name: props.student_last_name,
            student_username: props.student_username,
            student_id: props.student_id,
            section_name: props.section_name,
            section_code: props.section_code,
            seeComments: false
        }
    }

    flipSeeComments(e) {
        this.setState({
            seeComments: !this.state.seeComments
        })
    }

    getComment(comment) {
        return(
            <InputGroup className="p-1">
                <InputGroup.Text className="w-25 justify-content-md-center">
                    < a href={`/profile/${comment.student_username}`} class="text-dark text-decoration-none">
                    {comment.student_first_name} {" "} {comment.student_last_name}
                      </a>
                </InputGroup.Text>
                <Form.Control as="textarea"
                            className="text-center vertical-align-center"
                            size="sm"
                            rows={1}
                            value={comment.comment.comment_content}>
                </Form.Control>
            </InputGroup>
        )
    }

    getComments() {
        if (this.state.seeComments === false) return

        var comments = []
        for (var i = 0; i < this.state.comments.length; i++) {
            comments[i] = this.getComment(this.state.comments[i])
        }
        return (
            <div>
                <div class="row mh-150 overflow-auto p-2">
                    {comments}
                </div>
                <form onSubmit={this.handleComment}>
                <InputGroup>
                    <FormControl type="text"
                                placeholder="Add a comment"
                                name="comment_content"
                                size="sm">
                    </FormControl>
                    <Button variant="dark" type="submit">
                        +
                    </Button>
                </InputGroup>
                </form>
            </div>
        )
    }

    handleLike() {
        postRequest('/like', {
            post_id: this.state.post.id,
            likes: this.state.post.likes + 1
        }).then(data => {
            if (data.success === false) return
            this.setState({ post: data.result })
        })
    }

    handleComment(e) {
        e.preventDefault()

        if (e.target.comment_content.value == "") return

        postRequest('/comment', {
            post_id: this.state.post.id,
            comment_content: e.target.comment_content.value,
            student_id: this.state.student_id
        }).then(data => {
            if (data.success === false) return

            var comments = this.state.comments
            comments[comments.length] = new Comment(
                data.result,
                this.state.student_first_name,
                this.state.student_last_name,
                this.state.student_username)

            e.target.comment_content.value = ""

            this.setState({ comments: comments })
        })

    }

    getSection() {
        if(this.state.section_name == "") return
        return(this.state.section_name)
    }

    getNewLine() {
        if(this.state.section_name == "") return
        return(<br></br>)
    }

    render() {
        var d = new Date(this.state.post.post_time)
        return (
            <div class="row">
                <div class="row p-2">
                <div class="col">
                <InputGroup>
                    <InputGroup.Text className="w-40 justify-content-md-center">
                        {this.getSection()}
                        {this.getNewLine()}
                        {this.state.student_first_name} {" "}
                        {this.state.student_last_name}
                        <br></br>
                        {d.toLocaleString()}
                    </InputGroup.Text>
                    <Form.Control as="textarea"
                    value={this.state.post.post_content}
                    className="text-center mr-10"
                    rows={3}
                    readonly/>
                    <ButtonGroup vertical className="w-8">
                        <ButtonGroup  className="h-50">
                        <Button variant="outline-dark"
                            size="sm"
                            className="w-50"
                            disabled>
                            {this.state.comments.length}
                        </Button>
                        <Button variant="outline-dark"
                            size="sm"
                            className="w-50"
                            onClick={this.flipSeeComments}>
                            <FaRegCommentDots/>
                        </Button>
                        </ButtonGroup>
                        <ButtonGroup className="h-50">
                        <Button variant="outline-dark"
                            size="sm"
                            className="w-50"
                            disabled>
                            {this.state.post.likes}
                        </Button>
                        <Button variant="outline-dark"
                            size="sm"
                            className="w-50"
                            onClick={this.handleLike}>
                            <FaRegHeart/>
                        </Button>
                        </ButtonGroup>
                    </ButtonGroup>
                </InputGroup>
                </div>
                </div>
                <div class="row justify-content-md-center">
                    <div class="col-11">
                    {this.getComments()}
                    </div>
                </div>
            </div>
        )
    }
}

export default PostRender;