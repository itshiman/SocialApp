import { Component } from 'react';
import {
  Button,
  ModalHeader,
  ModalBody,
  Modal,
  Label,
  Col,
  Row,
} from 'reactstrap';
import { serverUrl } from '../config';
import { LocalForm, Control, Errors } from 'react-redux-form';

const maxLength = (len) => (val) => !val || val.length <= len;
const minLength = (len) => (val) => val && val.length >= len;
const required = (val) => val && val.length;

class CommentForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isCommentFormOpen: false,
    };
    this.toggleCommentForm = this.toggleCommentForm.bind(this);
    this.handleCommentFormSubmit = this.handleCommentFormSubmit.bind(this);
  }

  toggleCommentForm() {
    this.setState({
      isCommentFormOpen: !this.state.isCommentFormOpen,
    });
  }

  handleCommentFormSubmit(values) {
    this.toggleCommentForm();
    console.log(values);
    const newComment = {
      userId: this.props.user.username,
      comment: values.comment,
    };

    fetch(`${serverUrl}/posts/${this.props.post._id}/comments`, {
      method: 'POST',
      body: JSON.stringify(newComment),
      headers: {
        'Content-Type': 'application/JSON',
        Authorization: 'bearer ' + this.props.user.token,
      },
      credentials: 'same-origin',
    })
      .then(
        (response) => {
          if (response.ok) {
            return response;
          } else {
            var error = new Error(
              'Error ' + response.status + ': ' + response.statusText
            );
            error.response = response;
            throw error;
          }
        },
        (error) => {
          var errmess = new Error(error.message);
          throw errmess;
        }
      )
      .then((response) => {
        response.json();
        window.location.reload();
      })
      .catch((error) => {
        console.log('Post Comments', error.message);
        alert('Your Comment could not be posted\n Error: ' + error.message);
      });
  }

  render() {
    return (
      <div>
        <Button outline onClick={this.toggleCommentForm}>
          <span className='fa fa-comments fa-lg'></span>Submit Comment
        </Button>
        <Modal
          style={{ marginTop: '100px' }}
          isOpen={this.state.isCommentFormOpen}
          toggle={this.toggleCommentForm}>
          <ModalHeader toggle={this.toggleCommentForm}>
            Submit Comment
          </ModalHeader>
          <ModalBody>
            <LocalForm
              onSubmit={(values) => this.handleCommentFormSubmit(values)}>
              <Row className='form-group'>
                <Label htmlfor='comment' md={5}>
                  Comment
                </Label>
                <Col md={10}>
                  <Control.textarea
                    model='.comment'
                    id='comment'
                    name='comment'
                    rows='6'
                    className='form-control'
                  />
                </Col>
              </Row>
              <Row className='form-group'>
                <Col md={{ size: 10 }}>
                  <Button type='submit' color='primary'>
                    Submit
                  </Button>
                </Col>
              </Row>
            </LocalForm>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}
export default CommentForm;
