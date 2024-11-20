import React from 'react'
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

export default function AddMeetingButton() {
    return (
        <TouchableOpacity onPress={handleSubmit} style={styles.actionButton}>
            <LinearGradient colors={['#6a11cb', '#2575fc']} style={styles.gradientBackground}>
                <Text style={styles.buttonText}>Add Meeting</Text>
                <Icon name="check-circle" size={24} color="#fff" />
            </LinearGradient>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    actionButton: { alignItems: 'center', marginTop: 20 },
    gradientBackground: { padding: 15, borderRadius: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
    buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginRight: 10 },
  });
  