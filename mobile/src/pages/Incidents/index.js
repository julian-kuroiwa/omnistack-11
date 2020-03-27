import React, { useEffect, useState } from "react";
import { View, FlatList, Image, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { Feather } from "@expo/vector-icons";

import Logo from "../../assets/logo.png";

import style from "./style";
import api from "../../services/api";

const Incidents = () => {
  const navigation = useNavigation();
  let [incidents, setIncidents] = useState([]);
  let [total, setTotal] = useState(0);
  let [page, setPage] = useState(1);
  let [loading, setLoading] = useState(false);

  const navigateToDetail = (incident) => {
    navigation.navigate("Detail", { incident });
  }

  const loadIncidents = async() => {
    if(loading) {
      return;
    }

    if(total > 0 && incidents.length === total) {
      return;
    }

    setLoading(true);

    const response = await api.get('incidents', {
      params: page,
    });

    setTotal(response.headers["x-total-count"]);
    setLoading(false);
    setPage(total + 1);
    setIncidents([...incidents, ...response.data]);
  } 

  useEffect(() => {
    loadIncidents();
  }, [])

  return (
    <View style={style.container}>
      <View style={style.header}>
        <Image source={Logo} />
        <Text style={style.headerText}>
          Total de <Text style={style.headerTextBold}>{total} casos</Text>
        </Text>
      </View>
      <Text style={style.title}>
        Bem vindo!
      </Text>
      <Text style={style.description}>Escolha um dos casos abaixo e salve o dia.</Text>
      
      <FlatList 
      style={style.incidentList}
      data={incidents}
      showsVerticalScrollIndicator={false}
      keyExtractor={incident => String(incident.id)}
      onEndReached={() => loadIncidents}
      onEndReachedThreshold={0.2}
      renderItem={({item: incident}) => (
        <View style={style.incident}>
          <Text style={style.incidentProperty}>Ong:</Text>
          <Text style={style.incidentValue}>{incident.name}</Text>
          <Text style={style.incidentProperty}>Caso:</Text>
          <Text style={style.incidentValue}>{incident.title}</Text>
          <Text style={style.incidentProperty}>Valor:</Text>
          <Text style={style.incidentValue}>{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(incident.value)}</Text>

          <TouchableOpacity 
            style={style.detailsButton} 
            onPress={() => navigateToDetail(incident)}>
              <Text style={style.detailsButtonText}>Ver mais detalhes</Text>
              <Feather name="arrow-right" size={16} color="#e02041" />
            </TouchableOpacity>
        </View>
      )} />
    </View>
  )
}

export default Incidents;