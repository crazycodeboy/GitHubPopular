 /**
 * The examples provided by Facebook are for non-commercial testing and
 * evaluation purposes only.
 *
 * Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
 * OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN
 * AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * @flow
 */
'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableNativeFeedback,
  View
} = ReactNative;

// var getStyleFromScore = require('./getStyleFromScore');
// var getImageSource = require('./getImageSource');
// var getTextFromScore = require('./getTextFromScore');

var MovieCell = React.createClass({
  render: function() {
    var TouchableElement = TouchableHighlight;
    if (Platform.OS === 'android') {
      TouchableElement = TouchableNativeFeedback;
    }
    return (
      <View>
        <TouchableElement
          onPress={this.props.onSelect}
          onShowUnderlay={this.props.onHighlight}
          onHideUnderlay={this.props.onUnhighlight}
          >
          <View style={styles.row}>
              <Text style={styles.title}>
                {this.props.item.name}
              </Text>
              <Text style={styles.description}>
                {this.props.item.stargazers_count}
              </Text>
              <Text style={styles.description}>
                {this.props.item.description}
              </Text>
          </View>
        </TouchableElement>
      </View>

    );
  }
});

var styles = StyleSheet.create({
  title: {
    fontSize: 18,
    marginBottom: 2,

  },
  description: {
    fontSize: 12,
    marginBottom: 2,

  },
  row: {
    backgroundColor: '#f0f8ff',
    padding: 5,
  },
});

module.exports = MovieCell;
