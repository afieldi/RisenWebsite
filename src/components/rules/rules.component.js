import React, {Component} from 'react';
import { Container } from 'react-bootstrap';
import { Editor } from '@tinymce/tinymce-react';

export default class Rules extends Component {
  save(event) {
    console.log(event.content)
    console.log(Object.keys(event));
    // fetch({
      
    // })
  }
  render() {
    return (
      <section>
        <Container>
          <br></br>
          <br></br>
          <form action="http://localhost:5000/textual/rules/aaa" method="POST" onSubmit={this.save}>
            <Editor 
              initialValue="<p>This is the initial content of the editor</p>"
              apiKey="0bywxjfp48s20j6x04oex6cdpv3vh4rq3esu77wd5bdono4z"
              onSaveContent={this.save}
              init={{
                height: 500,
                menubar: true,
                plugins: [
                  'advlist autolink lists link image charmap print preview anchor',
                  'searchreplace visualblocks code fullscreen',
                  'insertdatetime media table paste code help wordcount save'
                ],
                toolbar:
                  'undo redo | formatselect | bold italic backcolor | \
                  alignleft aligncenter alignright alignjustify | \
                  bullist numlist outdent indent | removeformat | help | save \
                  '
              }}
            />
          </form>
        </Container>
      </section>
    )
  }
}