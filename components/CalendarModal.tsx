import React, { useState, useEffect } from 'react';
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

interface CalendarModalProps {
    visible: boolean;
    onClose: () => void;
    onSelectDate: (date: string) => void;
    initialDate?: string;
}

const MONTHS = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const DAYS_OF_WEEK = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'];

export function CalendarModal({ visible, onClose, onSelectDate, initialDate }: CalendarModalProps) {
    const today = new Date();
    const [currentYear, setCurrentYear] = useState(today.getFullYear());
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [selectedDateStr, setSelectedDateStr] = useState('');
    const [showYearPicker, setShowYearPicker] = useState(false);

    useEffect(() => {
        if (initialDate) {
            const parts = initialDate.split('-');
            if (parts.length === 3) {
                const y = parseInt(parts[0], 10);
                const m = parseInt(parts[1], 10) - 1;
                if (!isNaN(y) && !isNaN(m)) {
                    setCurrentYear(y);
                    setCurrentMonth(m);
                    setSelectedDateStr(initialDate);
                }
            }
        }
    }, [initialDate, visible]);

    const getDaysInMonth = (year: number, month: number) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (year: number, month: number) => {
        return new Date(year, month, 1).getDay();
    };

    const handlePrevMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(prev => prev - 1);
        } else {
            setCurrentMonth(prev => prev - 1);
        }
    };

    const handleNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(prev => prev + 1);
        } else {
            setCurrentMonth(prev => prev + 1);
        }
    };

    const handleSelectDay = (day: number) => {
        const monthStr = String(currentMonth + 1).padStart(2, '0');
        const dayStr = String(day).padStart(2, '0');
        const dateStr = `${currentYear}-${monthStr}-${dayStr}`;
        setSelectedDateStr(dateStr);
        onSelectDate(dateStr);
        onClose();
    };

    // Generate years from 1930 to current year + 5
    const years: number[] = [];
    const endYear = today.getFullYear() + 5;
    for (let y = endYear; y >= 1930; y--) {
        years.push(y);
    }

    const renderCalendarGrid = () => {
        const daysInMonth = getDaysInMonth(currentYear, currentMonth);
        const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
        const gridCells = [];

        // Blank cells before the first day of the month
        for (let i = 0; i < firstDay; i++) {
            gridCells.push(<View key={`empty-${i}`} style={styles.dayCellEmpty} />);
        }

        // Days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const monthStr = String(currentMonth + 1).padStart(2, '0');
            const dayStr = String(day).padStart(2, '0');
            const cellDateStr = `${currentYear}-${monthStr}-${dayStr}`;
            const isSelected = cellDateStr === selectedDateStr;
            const isToday =
                day === today.getDate() &&
                currentMonth === today.getMonth() &&
                currentYear === today.getFullYear();

            gridCells.push(
                <TouchableOpacity
                    key={`day-${day}`}
                    style={[
                        styles.dayCell,
                        isToday && styles.dayCellToday,
                        isSelected && styles.dayCellSelected
                    ]}
                    onPress={() => handleSelectDay(day)}
                >
                    <Text
                        style={[
                            styles.dayText,
                            isToday && styles.dayTextToday,
                            isSelected && styles.dayTextSelected
                        ]}
                    >
                        {day}
                    </Text>
                </TouchableOpacity>
            );
        }

        return <View style={styles.grid}>{gridCells}</View>;
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
                <TouchableOpacity style={styles.card} activeOpacity={1}>
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={handlePrevMonth} style={styles.navButton}>
                            <Ionicons name="chevron-back" size={24} color="#e83e8c" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => setShowYearPicker(!showYearPicker)}
                            style={styles.monthYearSelector}
                        >
                            <Text style={styles.monthYearText}>
                                {MONTHS[currentMonth]} {currentYear}
                            </Text>
                            <Ionicons
                                name={showYearPicker ? "chevron-up" : "chevron-down"}
                                size={16}
                                color="#e83e8c"
                                style={{ marginLeft: 4 }}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={handleNextMonth} style={styles.navButton}>
                            <Ionicons name="chevron-forward" size={24} color="#e83e8c" />
                        </TouchableOpacity>
                    </View>

                    {showYearPicker ? (
                        <View style={styles.yearPickerContainer}>
                            <Text style={styles.pickerTitle}>Selecciona el Año</Text>
                            <FlatList
                                data={years}
                                keyExtractor={(item) => item.toString()}
                                style={styles.yearList}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={[
                                            styles.yearItem,
                                            item === currentYear && styles.yearItemActive
                                        ]}
                                        onPress={() => {
                                            setCurrentYear(item);
                                            setShowYearPicker(false);
                                        }}
                                    >
                                        <Text
                                            style={[
                                                styles.yearItemText,
                                                item === currentYear && styles.yearItemTextActive
                                            ]}
                                        >
                                            {item}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            />
                        </View>
                    ) : (
                        <View style={styles.calendarBody}>
                            {/* Days of week header */}
                            <View style={styles.daysOfWeekContainer}>
                                {DAYS_OF_WEEK.map((day) => (
                                    <Text key={day} style={styles.dayOfWeekText}>
                                        {day}
                                    </Text>
                                ))}
                            </View>

                            {/* Calendar Grid */}
                            {renderCalendarGrid()}
                        </View>
                    )}

                    {/* Footer buttons */}
                    <View style={styles.footer}>
                        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                            <Text style={styles.closeButtonText}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </TouchableOpacity>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        width: Dimensions.get('window').width * 0.88,
        maxWidth: 360,
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        paddingHorizontal: 4,
    },
    navButton: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: '#FFF5F9',
    },
    monthYearSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 12,
        backgroundColor: '#FFF5F9',
    },
    monthYearText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#e83e8c',
    },
    calendarBody: {
        width: '100%',
    },
    daysOfWeekContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        paddingBottom: 8,
    },
    dayOfWeekText: {
        width: 38,
        textAlign: 'center',
        fontWeight: '600',
        color: '#888',
        fontSize: 13,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
    },
    dayCell: {
        width: `${100 / 7}%`,
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100,
        marginVertical: 2,
    },
    dayCellEmpty: {
        width: `${100 / 7}%`,
        aspectRatio: 1,
    },
    dayCellToday: {
        borderWidth: 1.5,
        borderColor: '#e83e8c',
    },
    dayCellSelected: {
        backgroundColor: '#e83e8c',
    },
    dayText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
    },
    dayTextToday: {
        color: '#e83e8c',
        fontWeight: 'bold',
    },
    dayTextSelected: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    yearPickerContainer: {
        height: 240,
        alignItems: 'center',
        paddingVertical: 8,
    },
    pickerTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 12,
    },
    yearList: {
        width: '100%',
    },
    yearItem: {
        paddingVertical: 12,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#F8F9FA',
    },
    yearItemActive: {
        backgroundColor: '#FFF5F9',
    },
    yearItemText: {
        fontSize: 16,
        color: '#666',
    },
    yearItemTextActive: {
        color: '#e83e8c',
        fontWeight: 'bold',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        paddingTop: 12,
    },
    closeButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
    },
    closeButtonText: {
        color: '#888',
        fontWeight: '600',
        fontSize: 14,
    },
});
