import React from 'react';
import Relay from 'react-relay';
import cookie from 'react-cookie';
import {
    View,
    Text,
    StyleSheet
} from 'react-native';

import moment from 'moment';
import Card from './base/card';
import Button from './base/button';
import ListView from './base/listView';

const styles = StyleSheet.create({
    container: {
        padding: '2em',
        width: '75vw',
        marginTop: '3em',
        marginRight: 'auto',
        marginLeft: 'auto',
        boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
        borderRadius: 2
    },
    btn: {
        flex: 1,
        marginTop: '2em'
    },
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 20
    },
    modal: {
        padding: '3em',
        width: '75vw',
        backgroundColor: 'white',
        boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
        borderRadius: 4
    },
    text: {
        fontSize: '1.5em'
    },
    exit: {
        width: '2.5em',
        alignSelf: 'flex-end',
        borderWidth: 1,
        borderRadius: 3,
        borderColor: '#9e0909',
        backgroundColor: '#9e0909',
        paddingRight: '2.1em'
    },
    row: {
        flexDirection: 'row'
    },
    flex: {
        flex: 1
    },
    justify: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    align: {
        alignSelf: 'center'
    }
});

class Travel extends React.Component {
    static propTypes = {
        train: React.PropTypes.object
    };

    constructor(props) {
        super(props);
        this.reserve = this.reserve.bind(this);
        this.pay = this.pay.bind(this);
    }

    reserve() {
        if (cookie.load('token')) {
            this.pay();
        } else {
            // Show Modal
        }
    }

    pay() {
        // Open popup
    }

    render() {
        if (this.props.train.start.edges.length !== 0 && this.props.train.end.edges.length !== 0) {
            const stations = this.props.train.start.edges
                .concat([{node: {id: 'separator', name: '...'}}])
                .concat(this.props.train.end.edges);

            const dateFormatted = moment(this.props.train.date).calendar();

            return (
                <Card style={styles.container}>
                    <View style={styles.row}>
                        <ListView style={styles.flex} dataSource={stations}
                            renderRow={edge => <Text style={styles.align} key={edge.node.id}>{edge.node.name}</Text>}/>
                        <View style={[styles.flex, styles.justify]}>
                            <Text>Price : {this.props.train.price} €</Text>
                            <Text>Date : {dateFormatted}</Text>
                        </View>
                    </View>
                    <Button style={styles.btn} onPress={this.reserve}>
                        <Text style={Button.Text}>Reserve</Text>
                    </Button>
                </Card>
            );
        }

        return null;
    }
}
export default Relay.createContainer(Travel, {
    fragments: {
        train: () => Relay.QL`
            fragment on Train {
                price
                date
                start: stations(first: 5) {
                    edges {
                        node {
                            id
                            name
                        }
                    }
                }
                end: stations(last: 5) {
                    edges {
                        node {
                            id
                            name
                        }
                    }
                }
            }
        `
    }
});
