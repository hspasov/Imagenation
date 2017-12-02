import React from "react";
import { Container, Divider, Dropdown, Grid, Header, Image, Input, List, Menu, Segment } from "semantic-ui-react";

const Jimp = window.require("jimp");

class AppContainer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            image: ""
        };

        this.handleSelectImage = this.handleSelectImage.bind(this);
    }

    handleSelectImage(event) {
        if (event.target.files[0]) {
            let file = event.target.files[0];
            console.log(file.path);
            Jimp.read(file.path, (err, image) => {
                image.clone().color([
                    { apply: 'hue', params: [-90] },
                    { apply: 'lighten', params: [50] },
                    { apply: 'xor', params: ['#06D'] }
                ]).write(file.path);
            });
            this.setState({ image: file.path });
        }
    }

    render() {
        return (
            <div>
                <Menu fixed="top" inverted>
                    <Container>
                        <Menu.Item as="a" header>
                            Project Name
                        </Menu.Item>
                        <Menu.Item as="a">Home</Menu.Item>

                        <Dropdown item simple text="Dropdown">
                            <Dropdown.Menu>
                                <Dropdown.Item>List Item</Dropdown.Item>
                                <Dropdown.Item>List Item</Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Header>Header Item</Dropdown.Header>
                                <Dropdown.Item>
                                    <i className="dropdown icon" />
                                    <span className="text">Submenu</span>
                                    <Dropdown.Menu>
                                        <Dropdown.Item>List Item</Dropdown.Item>
                                        <Dropdown.Item>List Item</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown.Item>
                                <Dropdown.Item>List Item</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Container>
                </Menu>

                <Container text style={{ marginTop: "7em" }}>
                    <Input type="file" onChange={this.handleSelectImage} />
                    <Image src={this.state.image} size="large"></Image>
                    <Header as="h1">Semantic UI React Fixed Template</Header>
                    <p>This is a basic fixed menu template using fixed size containers.</p>
                    <p>A text container is used for the main container, which is useful for single column layouts.</p>

                </Container>

                <Segment
                    inverted
                    vertical
                    style={{ margin: "5em 0em 0em", padding: "5em 0em" }}
                >
                    <Container textAlign="center">
                        <Grid divided inverted stackable>
                            <Grid.Row>
                                <Grid.Column width={3}>
                                    <Header inverted as="h4" content="Group 1" />
                                    <List link inverted>
                                        <List.Item as="a">Link One</List.Item>
                                        <List.Item as="a">Link Two</List.Item>
                                        <List.Item as="a">Link Three</List.Item>
                                        <List.Item as="a">Link Four</List.Item>
                                    </List>
                                </Grid.Column>
                                <Grid.Column width={3}>
                                    <Header inverted as="h4" content="Group 2" />
                                    <List link inverted>
                                        <List.Item as="a">Link One</List.Item>
                                        <List.Item as="a">Link Two</List.Item>
                                        <List.Item as="a">Link Three</List.Item>
                                        <List.Item as="a">Link Four</List.Item>
                                    </List>
                                </Grid.Column>
                                <Grid.Column width={3}>
                                    <Header inverted as="h4" content="Group 3" />
                                    <List link inverted>
                                        <List.Item as="a">Link One</List.Item>
                                        <List.Item as="a">Link Two</List.Item>
                                        <List.Item as="a">Link Three</List.Item>
                                        <List.Item as="a">Link Four</List.Item>
                                    </List>
                                </Grid.Column>
                                <Grid.Column width={3}>
                                    <Header inverted as="h4" content="Footer Header" />
                                    <p>Extra space for a call to action inside the footer that could help re-engage users.</p>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>

                        <Divider inverted section />
                        <List horizontal inverted divided link>
                            <List.Item as="a" href="#">Site Map</List.Item>
                            <List.Item as="a" href="#">Contact Us</List.Item>
                            <List.Item as="a" href="#">Terms and Conditions</List.Item>
                            <List.Item as="a" href="#">Privacy Policy</List.Item>
                        </List>
                    </Container>
                </Segment>
            </div>
        );
    }
};

export default AppContainer;