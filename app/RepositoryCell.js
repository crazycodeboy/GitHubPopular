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

var MovieCell = React.createClass({
  render: function() {
    var TouchableElement = TouchableHighlight;
    if (Platform.OS === 'android') {
      TouchableElement = TouchableNativeFeedback;
    }
    return (
      <TouchableElement
        onPress={this.props.onSelect}
        onShowUnderlay={this.props.onHighlight}
        onHideUnderlay={this.props.onUnhighlight}>
          <View style={styles.row}>
            <View style={{flexDirection:'row',justifyContent:'space-between'}}>
              <Text style={styles.title}>
                {this.props.item.full_name}
              </Text>
              <Image
                style={{width:26,height:26,}}
                source={require('../res/images/ic_star_border_green_24dp.png')} />
           </View>
           <Text style={styles.description}>
            {this.props.item.description}
           </Text>
           <View style={{flexDirection:'row',justifyContent:'space-between',}}>
              <View style={{flexDirection:'row',alignItems:'center'}}>
                <Text>Author: </Text>
                <Image
                  style={{width:26,height:26,}}
                  source={{uri: this.props.item.owner.avatar_url}}
                />
              </View>
              <View style={{flexDirection:'row',alignItems:'center'}}>
                <Text>Stars:  </Text>
                <Text>
                  {this.props.item.stargazers_count}
                </Text>
              </View>
           </View>
        </View>
      </TouchableElement>
    );
  }
});

var styles = StyleSheet.create({
  title: {
    fontSize: 12,
    marginBottom: 2,

  },
  description: {
    fontSize: 12,
    marginBottom: 2,

  },
  row: {
    backgroundColor: '#ffffff',
    padding: 5,
  },
});

module.exports = MovieCell;
