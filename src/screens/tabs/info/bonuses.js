import React from "react";
import {
  Text,
  StyleSheet,
  Dimensions,
  View,
  FlatList,
  Modal,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import {
  Button,
  List,
  ListItem,
  Left,
  Right,
  Body,
  Card,
  CardItem,
  Fab,
  Form,
  Input,
  Thumbnail,
} from "native-base";
import Constants from "expo-constants";
import { LiteCreditCardInput } from "react-native-credit-card-input";
import HeaderDrawer from "./components/header";
import {
  AntDesign,
  EvilIcons,
  FontAwesome,
  FontAwesome5,
} from "@expo/vector-icons";
import firebase from "../../../functions/firebase/firebaseConfig";
import Textpopins from "../../../functions/screenfunctions/text";
const { width, height } = Dimensions.get("window");
import { t } from "../../../functions/lang";
const pinicon = require("../../../../assets/images/Pin/pin.png");
import { makeid, hideNumb } from "../../../functions/standart/helper";
import { StatusBar } from "expo-status-bar";

export default class Bonuses extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cards: [],
      cardCount: 0,
      active: false,
      cardInfos: [],
      pinCode: null,
      loading: true,
      refreshing: true,
    };
  }

  async getInfo() {
    var datas = [];
    firebase
      .database()
      .ref("users/Dj8BIGEYS1OIE7mnOd1D2RdmchF3/cards")
      .on("value", (data) => {
        data.forEach((data) => {
          datas.push(data.val());
        });
        this.setState({
          cards: datas,
          loading: false,
          refreshing: false,
          cardCount: data.numChildren(),
        });
        this.listComponent();
      });
  }

  componentDidMount() {
    this.getInfo();
  }

  renderItems({ item, index }) {
    var that = this;

    function deleteItem(index) {
      Alert.alert(
        t("actions.wantdelete"),
        t("actions.notrecovered"),
        [
          {
            text: t("actions.cancel"),
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          {
            text: t("actions.delete"),
            onPress: () => deleteYes(index),
            style: "destructive",
          },
        ],
        { cancelable: true }
      );
    }

    function deleteYes(index) {
      var user = firebase.auth().currentUser;
      if (
        that.state.cardCount < 2 ||
        that.state.cardCount == 1 ||
        that.state.cardCount === 1
      ) {
        that.dropDownAlertRef.alertWithType("error", t("cards.minimal"));
      } else {
        firebase
          .database()
          .ref("users/Dj8BIGEYS1OIE7mnOd1D2RdmchF3/cards/" + index)
          .remove()
          .then(
            () => {
              that.setState({ cards: null, cardCount: 1, refreshing: true });
              that.dropDownAlertRef.alertWithType(
                "success",
                t("actions.deleted")
              );
              that.handleRefresh();
            },
            (err) => {
              that.dropDownAlertRef.alertWithType("error", err.message);
              that.handleRefresh();
            }
          );
      }
    }

    function cardTypeFunc() {
      switch (item.cardInfo.type) {
        case "visa":
          return <FontAwesome name="cc-visa" size={30} color="#7c9d32" />;
          break;
        case "master-card":
          return <FontAwesome name="cc-mastercard" size={30} color="#7c9d32" />;
          break;
        case "american-express":
          return <FontAwesome name="cc-amex" size={30} color="#7c9d32" />;
          break;
        case "discover":
          return <FontAwesome name="cc-discover" size={30} color="#7c9d32" />;
          break;
        case "jcb":
          return <FontAwesome name="cc-jcb" size={30} color="#7c9d32" />;
          break;
        case "diners-club-north-america":
          return (
            <FontAwesome name="cc-diners-club" size={30} color="#7c9d32" />
          );
          break;
        case "diners-club":
          return (
            <FontAwesome name="cc-diners-club" size={30} color="#7c9d32" />
          );
          break;
        case "diners-club-carte-blanche":
          return (
            <FontAwesome name="cc-diners-club" size={30} color="#7c9d32" />
          );
          break;
        case "diners-club-international":
          return (
            <FontAwesome name="cc-diners-club" size={30} color="#7c9d32" />
          );
          break;
        case "maestro":
          return (
            <FontAwesome name="credit-card-alt" size={30} color="#7c9d32" />
          );
          break;
        case "visa-electron":
          return <FontAwesome5 name="cc-visa" size={30} color="#7c9d32" />;
          break;
        default:
          return <FontAwesome name="credit-card" size={30} color="#7c9d32" />;
      }
    }

    return (
      <ListItem thumbnail>
        <Left>{cardTypeFunc()}</Left>
        <Body>
          <Text
            style={styles.cardNumbText}
            children={hideNumb(item.cardInfo.number)}
          />
          <Text children={item.cardInfo.cvc + " Azn"} />
        </Body>
        <Right>
          <Button transparent onPress={() => deleteItem(item.cardId)}>
            <EvilIcons name="trash" size={30} color="#BF360C" />
          </Button>
        </Right>
      </ListItem>
    );
  }

  async handleRefresh() {
    this.setState(
      {
        refreshing: true,
        loading: true,
      },
      () => {
        this.getInfo();
      }
    );
  }

  addCard = () => {
    if (this.state.pinCode == null) {
      this.setState({ active: false });
      this.dropDownAlertRef.alertWithType("info", t("pinCodeNull"));
    } else {
      this.setState({ active: false });
      var user = firebase.auth().currentUser;
      var uid = this.makeid("numb", 16);
      firebase
        .database()
        .ref("users/Dj8BIGEYS1OIE7mnOd1D2RdmchF3/cards/" + uid)
        .set({
          cardInfo: this.state.cardInfos,
          cardPass: this.state.pinCode,
          cardId: uid,
        })
        .then(
          () => {
            this.setState({
              active: false,
              cardInfos: null,
              pinCode: null,
              refreshing: true,
            });
            this.handleRefresh();
          },
          (err) => {
            this.handleRefresh();
          }
        );
    }
  };

  _onChange = (data) => {
    this.setState({ cardInfos: data.values });
  };

  listComponent() {
    return (
      <FlatList
        data={this.state.cards}
        renderItem={this.renderItems.bind(this)}
        keyExtractor={(item, index) => index.toString()}
        disableVirtualization
        refreshing={this.state.refreshing}
        onRefresh={this.handleRefresh}
      />
    );
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <HeaderDrawer {...this.props} name={t("drawer.bonuses")} />
        <View style={{ flex: 1 }}>
          {this.state.cardCount == 0 || this.state.cards == null ? (
            <List
              style={{
                marginTop: 5 * Constants.statusBarHeight,
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <Textpopins
                style={styles.nullObject}
                children={t("actions.noResult")}
              />
            </List>
          ) : (
            <ScrollView>
              <List style={{ flex: 1 }}>
                <ListItem thumbnail>
                  <Left>
                    <Thumbnail source={pinicon} />
                  </Left>
                  <Body>
                    <Text
                      style={styles.cardNumbText}
                      children={hideNumb("151561561561515")}
                    />
                    <Text children={"200  Azn"} />
                  </Body>
                  <Right>
                    <Button
                      transparent
                      onPress={() => this.props.navigation.navigate("Pininfo")}
                    >
                      <EvilIcons name="eye" size={30} color="#2196f3" />
                    </Button>
                  </Right>
                </ListItem>
                {this.listComponent()}
              </List>
            </ScrollView>
          )}
          <Fab
            active={this.state.active}
            direction="right"
            position="bottomRight"
            style={{ backgroundColor: "#7c9d32" }}
            onPress={() => this.setState({ active: !this.state.active })}
          >
            <AntDesign name="plus" size={24} color="#fff" />
          </Fab>

          <View>
            <Modal
              style={{
                width: width / 2,
                height: height / 2,
                backgroundColor: "#fff",
              }}
              animationType="slide"
              transparent={false}
              visible={this.state.active}
            >
              <StatusBar backgroundColor="#fff" />
              <Card
                style={{
                  width: "100%",
                  height: "100%",
                  backgroundColor: "#fff",
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center",
                }}
              >
                <CardItem header>
                  <Left>
                    <Textpopins
                      style={styles.modalTitle}
                      children={t("cards.cartadd")}
                    />
                  </Left>
                  <Right>
                    <TouchableOpacity
                      onPress={() => this.setState({ active: false })}
                    >
                      <FontAwesome
                        style={{ fontWeight: "bold" }}
                        name="close"
                        size={35}
                        color="#D50000"
                      />
                    </TouchableOpacity>
                  </Right>
                </CardItem>
                <CardItem>
                  <Form style={styles.form}>
                    <View style={styles.itemStyle}>
                      <View style={[styles.inputstyle, styles.cardInput]}>
                        <LiteCreditCardInput
                          keyboardShouldPersistTaps="handled"
                          keyboardType="number-pad"
                          onChange={this._onChange}
                        />
                      </View>
                    </View>
                    <View style={styles.itemStyle}>
                      <Input
                        style={styles.inputstyle}
                        keyboardType="number-pad"
                        keyboardShouldPersistTaps="handled"
                        placeholder={t("form.labels.password")}
                        maxLength={4}
                        placeholderTextColor="rgba(0,0,0,.4)"
                        secureTextEntry={true}
                        onChangeText={(text) =>
                          this.setState({ pinCode: text })
                        }
                      />
                    </View>
                  </Form>
                </CardItem>
                <CardItem footer>
                  <Button
                    style={styles.buttonStyle}
                    onPress={this.addCard}
                    success
                  >
                    <Textpopins
                      color="#fff"
                      style={{ padding: 15 }}
                      children={t("actions.submit")}
                    />
                  </Button>
                </CardItem>
              </Card>
            </Modal>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  cardNumbText: {
    fontSize: 17,
    color: "#6d7587",
    fontWeight: "bold",
  },
  thumbImage: {
    borderRadius: 100,
  },
  modalTitle: {
    fontSize: 23,
    color: "#010101",
    fontWeight: "bold",
  },
  cardItemRightButton: {
    backgroundColor: "transparent",
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  form: {
    padding: 0,
    margin: 0,
    width: width,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    marginTop: Constants.statusBarHeight,
  },
  itemStyle: {
    width: width - 50,
    height: 60,
    marginVertical: 10,
  },
  inputstyle: {
    height: 50,
    width: "100%",
    lineHeight: 40,
    borderColor: "#fff",
    backgroundColor: "#fff",
    borderWidth: 3,
    paddingLeft: 10,
    color: "#6d7587",
    fontWeight: "bold",
    fontSize: 16,
    borderRadius: 6,
    borderColor: "rgba(0,0,0,.4)",
    borderWidth: 2,
  },
  buttonstyle: {
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  cardInput: {
    width: width - 50,
  },
  nullObject: {
    color: "#D50000",
    textAlign: "center",
    alignContent: "center",
    alignItems: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
});
