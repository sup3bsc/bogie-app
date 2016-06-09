import React from 'react';
import Relay from 'react-relay';
import moment from 'moment';
import DatePicker from './base/datePicker';
import {
    View,
    Text,
    StyleSheet
} from 'react-native';

import {
    styles as fieldStyles
} from './base/field';
import Travel from './travel';
import Card from './base/card';
import Button from './base/button';
import Slider from './base/slider';
import AutoCompleteField from './base/autoComplete';

const styles = StyleSheet.create({
    date: {
        marginRight: 30
    },
    dateLabel: {
        marginBottom: '1.25rem'
    },
    container: {
        width: '75vw',
        marginTop: '3em',
        marginRight: 'auto',
        marginLeft: 'auto'
    },
    h1: {
        color: 'white'
    },
    row: {
        flexDirection: 'row'
    },
    btn: {
        flex: 1,
        marginTop: '2em'
    }
});

class Home extends React.Component {
    static propTypes = {
        viewer: React.PropTypes.object,
        relay: React.PropTypes.object
    };

    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
        this.state = {
            departure: '',
            arrival: '',
            date: moment()
        };
    }

    onSubmit() {
        this.props.relay.setVariables({
            departure: this.state.departure,
            arrival: this.state.arrival
        });
    }

    render() {
        const dateLink = {
            value: this.state.date,
            requestChange: date => {
                this.setState({date});
            }
        };
        const departureLink = {
            value: this.state.departure,
            requestChange: departure => {
                this.setState({departure});
            }
        };
        const arrivalLink = {
            value: this.state.arrival,
            requestChange: arrival => {
                this.setState({arrival});
            }
        };

        return (
            <View>
                <Card style={styles.container}>
                    <View style={styles.row}>
                        <AutoCompleteField name="Departure" valueLink={departureLink} viewer={this.props.viewer} />
                        <AutoCompleteField name="Arrival" valueLink={arrivalLink} viewer={this.props.viewer} />
                    </View>
                    <View style={styles.row}>
                        <View style={styles.date}>
                            <Text style={[fieldStyles.label, styles.dateLabel]}>Date</Text>
                            <DatePicker valueLink={dateLink}/>
                        </View>
                        <Slider/>
                    </View>
                    <View style={styles.row}>
                        <Button style={styles.btn} onPress={this.onSubmit}>
                            <Text style={Button.Text}>Search</Text>
                        </Button>
                    </View>
                </Card>
                <Travel departure={this.props.relay.variables.departure} arrival={this.props.relay.variables.arrival} viewer={this.props.viewer} />
            </View>
        );
    }
}

export default Relay.createContainer(Home, {
    initialVariables: {
        departure: '',
        arrival: ''
    },
    fragments: {
        viewer: variables => Relay.QL`
            fragment on Viewer {
                ${AutoCompleteField.getFragment('viewer')}
                ${AutoCompleteField.getFragment('viewer')}
                ${Travel.getFragment('viewer', {
                    departure: variables.departure,
                    arrival: variables.arrival
                })}
            }
        `
    }
});
