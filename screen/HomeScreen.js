import {
  Text,
  TextInput,
  Keyboard,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useState } from "react";
import axios from "axios";
import CircularProgress from "react-native-circular-progress-indicator";

const HomeScreen = () => {
  let API_KEY =
    "Enter Your API Key Here";
  const [report, setReport] = useState({});
  const [text, onChangeText] = useState("");
  let tet = text;
  const [loading, setLoading] = useState(false);

  const startLoading = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  };

  //REPORT
  const res = {
    method: "GET",
    url: "https://www.virustotal.com/vtapi/v2/url/report",
    params: {
      apikey: API_KEY,
      resource: tet,
      allinfo: "true",
      scan: "1",
    },
    headers: { accept: "application/json" },
  };

  const sendGetRequest = async () => {
    try {
      const resp = await axios.request(res);
      setReport(resp.data);
      // console.log(resp.data);
    } catch (err) {
      console.error(err);
    }
  };
  const CallBacker = () => {
    if (
      report.verbose_msg != undefined &&
      report.verbose_msg.slice(0, 13) == "Scan request"
    ) {
      sendGetRequest();
    }
  };

  

  return (
    <View className=" h-full items-center pt-20   bg-[#2b2a2a]">
      {/* Search Component */}
      <View className="flex-row h-16 overflow-hidden w-[80%] justify-center items-center">
        <Image
          className="h-16 w-16 mr-4 "
          source={require("../assets/fishlogo.png")}
        />
        <Text className="text-3xl font-extrabold  text-slate-100">Phisher</Text>
      </View>

      <View className="w-full items-center">
        <TextInput
          className="bg-white px-4 h-10 mt-10 rounded-xl w-[80%] mb-5"
          onChangeText={onChangeText}
          placeholder="Enter The Link Address Here"
          value={text}
        />
        <TouchableOpacity
          className=" mb-4 justify-center  rounded-xl items-center h-8 w-24 bg-[#740cc9]"
          onPress={() => {
            sendGetRequest();
            CallBacker();

            Keyboard.dismiss();
          }}
        >
          <Text className=" w-full text-center text-lg text-slate-100">
            Search
          </Text>
        </TouchableOpacity>
      </View>
      {/* <View className="m-3">
        {report.verbose_msg != undefined && (
          <Text className="text-[#76ee51]">{report.verbose_msg}</Text>
        )}
      </View> */}
      {/* Results Component */}
      <View className=" overflow-hidden flex-1  bg-[#131111] rounded-t-3xl w-full">
        <View className="h-24 rounded-3xl ease-in flex-row items-center justify-evenly bg-[#363232] border-8 px-4 border-[#131111]">
          {report.positives != undefined && report.total > 0 && (
            <CircularProgress
              value={report.positives}
              activeStrokeColor={"#da3d38"}
              radius={32}
              duration={2000}
              progressValueColor={"#ecf0f1"}
              maxValue={report.total}
              initialValue={0}
              title={"/ " + report.total}
              titleColor={"white"}
              titleStyle={{ fontWeight: "bold", marginTop: -4, fontSize: 12 }}
            />
          )}
          <View className="justify-evenly h-full">
            {report.verbose_msg != undefined &&
              report.positives != undefined &&
              report.total > 0 && (
                <Text
                  className={` ${
                    report.positives == 0 ? "text-lime-500" : "text-[#da3d38]"
                  } text-lg`}
                >
                  Flagged By {report.positives} Vendors
                </Text>
              )}

            {report.verbose_msg != undefined && (
              <Text
                className={`text-center ${
                  report.verbose_msg ==
                  "Scan request successfully queued, come back later for the report"
                    ? "text-lime-500"
                    : "text-slate-100"
                } text-base`}
              >
                {report.verbose_msg !=
                  "Scan request successfully queued, come back later for the report" &&
                report.total > 0
                  ? report.verbose_msg.slice(0, 13)
                  : report.verbose_msg}
              </Text>
            )}
          </View>
        </View>

        <ScrollView>
          <View className="items-center ease-in overflow-hidden mb-16   pt-1">
            {report &&
              report.scans &&
              Object.entries(report.scans)
                .filter(([key, value]) => value.detected == true)
                .map(([key, value]) => {
                  if (value.detected == true) {
                    return (
                      <View
                        key={key}
                        className="flex-row flex-1 h-16 rounded-2xl justify-between px-3 py-1 mb-1  w-[90%] bg-[#363232] mt-2 items-center "
                      >
                        <View className="flex flex-1 pl-3 ">
                          <Text key={key} className="text-slate-50 text-sm">
                            {key}
                          </Text>
                        </View>
                        <View className="bg-[#da3d38] justify-center rounded-xl h-[80%]">
                          <Text className="text-slate-50  text-center text-xs w-32  ">
                            {value.result.toUpperCase()}
                          </Text>
                        </View>
                      </View>
                    );
                  }
                })}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default HomeScreen;
