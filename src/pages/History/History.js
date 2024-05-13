import { useEffect, useState } from "react";
import { View, FlatList, Text, Image } from "react-native";
import { GlobalStyles } from "../../../GlobalStyles";
import Heading from "../../components/Heading";
import ExitButton from "../../components/ExitButton";
import Historypic from "../../../assets/Historypic.png";
import HistoryComp from "./HistoryComponent";
import baseUrl from "../../services/baseUrl";
import { useSelector } from "react-redux";
import axios from "axios";

const historyData = [
	{
		from: "block 14, johar karachi.",
		to: "block 3, gulshan karachi",
		date: "july 9, 2023",
		cost: 300
	},
	{
		from: "block 14, johar karachi.",
		to: "block 3, gulshan karachi",
		date: "july 9, 2023",
		cost: 300
	},
	{
		from: "block 14, johar karachi.",
		to: "block 3, gulshan karachi",
		date: "july 9, 2023",
		cost: 300
	},
	{
		from: "block 14, johar karachi.",
		to: "block 3, gulshan karachi ",
		date: "july 9, 2023",
		cost: 300
	},
	{
		from: "block 14, johar karachi.",
		to: "block 3, gulshan karachi",
		date: "july 9, 2023",
		cost: 300
	},
	{
		from: "block 14, johar karachi.",
		to: "block 3, gulshan karachi",
		date: "july 9, 2023",
		cost: 300
	},
	{
		from: "block 14, johar karachi.",
		to: "block 3, gulshan karachi",
		date: "july 9, 2023",
		cost: 300
	},
	{
		from: "block 14, johar karachi.",
		to: "block 3, gulshan karachi",
		date: "july 9, 2023",
		cost: 300
	},
]

const History = ({ navigation, route }) => {
	const [data, setData] = useState([]);
	const userData = useSelector(state => state?.user?.userAuthCredentials);
	useEffect(() => {
		axios.post(`${baseUrl}/users/info`, { email: userData?.email })
			.then((res) => {
				setData(res?.data?.History);
			}).catch((err) => {
				console.log('error', err)
			})
	}, [])
	return (
		
			<View style={[GlobalStyles.flex_1]}>
				<ExitButton navigation={navigation} path={"Main"} />

				<Heading text="History" />
				<View
					style={[
						GlobalStyles.marginTop_3
						, {
							flex: 1
						}]}
				>
					<FlatList
						data={data}
						keyExtractor={(item) => item?.time}
						initialNumToRender={5}
						renderItem={({ item }) => (
							<View
								style={
									[GlobalStyles.marginVertical_1]
								}
							>
								<HistoryComp item={item} navigation={navigation} route={route} />
							</View>
						)}
						ListEmptyComponent={
							<View
								style={[
									GlobalStyles.marginVertical_7,
									GlobalStyles.flex_1,
									GlobalStyles.alignItemsCenter,
									GlobalStyles.justifyContentCenter,
								]}
							>
								<Image source={Historypic} />
							</View>
						}
					/>

				</View>
			</View>
		
	);
};

export default History;
