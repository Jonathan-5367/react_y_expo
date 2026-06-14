import React from 'react';
import {
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    FlatList,
    Dimensions
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

interface Option {
    label: string;
    value: string;
}

interface DropdownSelectorProps {
    visible: boolean;
    onClose: () => void;
    selectedValue: string;
    onSelect: (value: string) => void;
    options: Option[];
    title?: string;
}

export function DropdownSelector({
    visible,
    onClose,
    selectedValue,
    onSelect,
    options,
    title = 'Seleccionar opción'
}: DropdownSelectorProps) {
    const renderOption = ({ item }: { item: Option }) => {
        const isSelected = item.value === selectedValue;
        return (
            <TouchableOpacity
                style={[
                    styles.optionItem,
                    isSelected && styles.optionItemActive
                ]}
                onPress={() => {
                    onSelect(item.value);
                    onClose();
                }}
            >
                <Text
                    style={[
                        styles.optionText,
                        isSelected && styles.optionTextActive
                    ]}
                >
                    {item.label}
                </Text>
                {isSelected && (
                    <Ionicons name="checkmark-circle" size={20} color="#e83e8c" />
                )}
            </TouchableOpacity>
        );
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
                <TouchableOpacity style={styles.card} activeOpacity={1}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>{title}</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeIcon}>
                            <Ionicons name="close" size={24} color="#e83e8c" />
                        </TouchableOpacity>
                    </View>

                    {/* Options list */}
                    <FlatList
                        data={options}
                        keyExtractor={(item) => item.value}
                        renderItem={renderOption}
                        style={styles.list}
                        ItemSeparatorComponent={() => <View style={styles.separator} />}
                    />
                </TouchableOpacity>
            </TouchableOpacity>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'flex-end', // slide up from bottom like a sheet
    },
    card: {
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 20,
        maxHeight: Dimensions.get('window').height * 0.5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333333',
    },
    closeIcon: {
        padding: 4,
    },
    list: {
        width: '100%',
    },
    optionItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 8,
        borderRadius: 12,
    },
    optionItemActive: {
        backgroundColor: '#FFF5F9',
    },
    optionText: {
        fontSize: 16,
        color: '#495057',
        fontWeight: '500',
    },
    optionTextActive: {
        color: '#e83e8c',
        fontWeight: 'bold',
    },
    separator: {
        height: 1,
        backgroundColor: '#F8F9FA',
    },
});
