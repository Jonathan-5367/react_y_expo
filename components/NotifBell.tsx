import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useState } from 'react';
import {
    Alert,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import { useNotifications, markRead, markAllRead } from '@/store/notifications';

export function NotifBell() {
    const { notifications, unreadCount } = useNotifications();
    const [open, setOpen] = useState(false);

    return (
        <>
            {/* Bell button */}
            <TouchableOpacity style={styles.bell} onPress={() => setOpen(true)}>
                <Ionicons name="notifications" size={28} color="#e83e8c" />
                {unreadCount > 0 && (
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>{unreadCount}</Text>
                    </View>
                )}
            </TouchableOpacity>

            {/* Dropdown panel */}
            <Modal
                transparent
                visible={open}
                animationType="fade"
                onRequestClose={() => setOpen(false)}
            >
                <TouchableWithoutFeedback onPress={() => setOpen(false)}>
                    <View style={styles.overlay} />
                </TouchableWithoutFeedback>

                <View style={styles.panel}>
                    <View style={styles.panelHeader}>
                        <View style={styles.panelTitleRow}>
                            <Ionicons name="notifications-circle" size={22} color="#e83e8c" />
                            <Text style={styles.panelTitle}>Notificaciones</Text>
                            {unreadCount > 0 && (
                                <View style={styles.badgeInline}>
                                    <Text style={styles.badgeInlineText}>{unreadCount} nuevas</Text>
                                </View>
                            )}
                        </View>
                        {unreadCount > 0 && (
                            <TouchableOpacity onPress={() => markAllRead()}>
                                <Text style={styles.markAll}>Marcar todas</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {notifications.length === 0 ? (
                        <View style={styles.empty}>
                            <Ionicons name="checkmark-done-circle-outline" size={36} color="#ccc" />
                            <Text style={styles.emptyText}>Sin notificaciones</Text>
                        </View>
                    ) : (
                        notifications.map(notif => (
                            <TouchableOpacity
                                key={notif.id}
                                style={[styles.notifCard, !notif.read && styles.notifCardUnread]}
                                onPress={() => { markRead(notif.id); }}
                            >
                                <View style={[styles.notifIcon, { backgroundColor: notif.color }]}>
                                    <Ionicons name={notif.icon as any} size={18} color="#FFF" />
                                </View>
                                <View style={styles.notifBody}>
                                    <View style={styles.notifTitleRow}>
                                        <Text style={styles.notifTitle}>{notif.title}</Text>
                                        {!notif.read && <View style={styles.dot} />}
                                    </View>
                                    <Text style={styles.notifMsg} numberOfLines={2}>{notif.message}</Text>
                                    <Text style={styles.notifTime}>{notif.time}</Text>
                                </View>
                            </TouchableOpacity>
                        ))
                    )}

                    <TouchableOpacity style={styles.closeBtn} onPress={() => setOpen(false)}>
                        <Text style={styles.closeBtnText}>Cerrar</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    bell: {
        position: 'relative',
        padding: 4,
    },
    badge: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: '#FF3B30',
        borderRadius: 10,
        minWidth: 18,
        height: 18,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 3,
    },
    badgeText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: 'bold',
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    panel: {
        position: 'absolute',
        top: 80,
        right: 16,
        left: 16,
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.18,
        shadowRadius: 24,
        elevation: 12,
        zIndex: 999,
    },
    panelHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 14,
    },
    panelTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    panelTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: '#222',
    },
    badgeInline: {
        backgroundColor: '#e83e8c',
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 2,
    },
    badgeInlineText: {
        color: '#FFF',
        fontSize: 11,
        fontWeight: '600',
    },
    markAll: {
        color: '#e83e8c',
        fontSize: 13,
        fontWeight: '600',
    },
    empty: {
        alignItems: 'center',
        paddingVertical: 20,
        gap: 8,
    },
    emptyText: {
        color: '#aaa',
        fontSize: 14,
    },
    notifCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#FAFAFA',
        borderRadius: 12,
        padding: 12,
        marginBottom: 10,
        gap: 12,
    },
    notifCardUnread: {
        borderLeftWidth: 4,
        borderLeftColor: '#e83e8c',
        backgroundColor: '#FFF5F9',
    },
    notifIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    notifBody: {
        flex: 1,
        gap: 3,
    },
    notifTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    notifTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#222',
    },
    dot: {
        width: 7,
        height: 7,
        borderRadius: 4,
        backgroundColor: '#e83e8c',
    },
    notifMsg: {
        fontSize: 12,
        color: '#555',
        lineHeight: 17,
    },
    notifTime: {
        fontSize: 11,
        color: '#aaa',
    },
    closeBtn: {
        alignItems: 'center',
        marginTop: 6,
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    closeBtnText: {
        color: '#e83e8c',
        fontWeight: '700',
        fontSize: 15,
    },
});
