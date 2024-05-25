import React, { useState, useEffect, useCallback } from 'react';
import { Text, View, TouchableOpacity, FlatList, TextInput, StyleSheet, SafeAreaView, ListRenderItem } from 'react-native';

interface Item {
  id: number;
  name: string;
}

interface AppProps {
  data: Item[];
}

const DATA_SOURCE = [{
  id: 1,
  name: 'Apple',
},
{
  id: 2,
  name: 'Banana',
},
]


const SimpleList = ({ data = DATA_SOURCE }: AppProps) => {
  const [selectedItemIds, setSelectedItemIds] = useState<number[]>([]);
  const [dataSource, setDataSource] = useState<Item[]>(data);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    setDataSource(data);
  }, [data]);

  const handleSearch = useCallback(() => {
    setDataSource(data.filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase())));
  }, [data, searchTerm]);

  useEffect(() => {
    const handler = setTimeout(handleSearch, 300);
    return () => clearTimeout(handler);
  }, [searchTerm, handleSearch]);

  const handleSelect = (id: number) => {
    const foundIndex = selectedItemIds.indexOf(id);
    const tempIds = [...selectedItemIds];
    if(foundIndex !== -1) {
      tempIds.splice(foundIndex, 1);
    } else {
      tempIds.push(id);
    };
    setSelectedItemIds(tempIds);
  };

  const handleClear = () => {
    setSearchTerm('');
  }

  const renderItem: ListRenderItem<Item> = useCallback(({ item }) => {
    const selected = selectedItemIds.includes(item.id);
    return (
      <TouchableOpacity style={[styles.box, selected && styles.selectedBox]} onPress={() => handleSelect(item.id)}>
        <Text style={styles.regularText}>{item.name}</Text>
      </TouchableOpacity>
    )}
  , [selectedItemIds]);

  const renderEmpty = () => <Text style={styles.lightText}>No results found</Text>

    return (
      <SafeAreaView style={styles.container} >
        <View style={styles.flexRow}>
          <TextInput
            onChangeText={setSearchTerm}
            placeholder='Search...'
            value={searchTerm}
            style={styles.searchContainer}
          />
          <TouchableOpacity style={styles.btnDesign} onPress={handleClear}>
            <Text style={styles.fs22}>X</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={dataSource}
          keyboardShouldPersistTaps="always"
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          ListEmptyComponent={renderEmpty}
        />
      </SafeAreaView>
    );
};

const styles = StyleSheet.create({
  box: {
    borderWidth: 0.5,
    borderRadius: 8,
    borderColor: 'black',
    padding: 12,
    marginBottom: 10,
  },
  selectedBox: {
    backgroundColor: 'lightblue',
  },
  regularText: {
    fontSize: 16,
    color: 'black'
  },
  container: {
    padding: 20,
  },
  searchContainer: {
    borderBottomWidth: 1,
    borderColor: 'black',
    padding: 10,
    flex: 0.94,
  },
  flexRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  btnDesign: {
    borderWidth: 1,
    justifyContent: 'center',
    paddingHorizontal: 18,
    borderRadius: 8,
  },
  fs22: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  lightText: {
    color: '#496A81',
  }
})

export default SimpleList;
