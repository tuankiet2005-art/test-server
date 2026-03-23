import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useLeaveRequests, useAdvanceRequests, useSalaryInfo } from '../../application/hooks';
import { getCurrentMonth, formatCurrency, formatDate } from '../../shared/utils';

const EmployeeDashboard = ({ route, navigation }) => {
  const { user, token } = route.params;
  const [activeTab, setActiveTab] = useState('overview');

  const {
    leaveRequests,
    loading: leaveLoading,
    createLeaveRequest
  } = useLeaveRequests();

  const {
    advanceRequests,
    loading: advanceLoading,
    createAdvanceRequest
  } = useAdvanceRequests();

  const {
    salaryInfo,
    loading: salaryLoading,
    fetchSalaryInfo
  } = useSalaryInfo();

  useEffect(() => {
    const currentMonth = getCurrentMonth();
    fetchSalaryInfo(currentMonth);
  }, []);

  const handleCreateLeaveRequest = () => {
    Alert.alert(
      'Create Leave Request',
      'This would open a form to create a new leave request',
      [{ text: 'OK' }]
    );
  };

  const handleCreateAdvanceRequest = () => {
    Alert.alert(
      'Create Advance Request',
      'This would open a form to create a new advance request',
      [{ text: 'OK' }]
    );
  };

  const renderOverview = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Salary Information</Text>
      {salaryLoading ? (
        <Text>Loading salary info...</Text>
      ) : salaryInfo ? (
        <View style={styles.salaryCard}>
          <Text style={styles.salaryMonth}>{salaryInfo.month}</Text>
          <Text style={styles.salaryAmount}>
            Net Salary: {formatCurrency(salaryInfo.netSalary)}
          </Text>
          <Text style={styles.salaryDetail}>
            Base: {formatCurrency(salaryInfo.baseSalary)}
          </Text>
          <Text style={styles.salaryDetail}>
            Advances: -{formatCurrency(salaryInfo.totalAdvances)}
          </Text>
          <Text style={styles.salaryDetail}>
            Deductions: -{formatCurrency(salaryInfo.totalDeductions)}
          </Text>
        </View>
      ) : (
        <Text>No salary information available</Text>
      )}
    </View>
  );

  const renderLeaveRequests = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Leave Requests</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleCreateLeaveRequest}>
          <Text style={styles.addButtonText}>+ New</Text>
        </TouchableOpacity>
      </View>
      {leaveRequests.map(request => (
        <View key={request.id} style={styles.requestCard}>
          <View style={styles.requestHeader}>
            <Text style={styles.requestDate}>{formatDate(request.date)}</Text>
            <Text style={[styles.statusBadge, styles[`status${request.status}`]]}>
              {request.status}
            </Text>
          </View>
          <Text>Time: {request.timePeriod}</Text>
          <Text>Reason: {request.reason}</Text>
        </View>
      ))}
    </View>
  );

  const renderAdvanceRequests = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Advance Requests</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleCreateAdvanceRequest}>
          <Text style={styles.addButtonText}>+ New</Text>
        </TouchableOpacity>
      </View>
      {advanceRequests.map(request => (
        <View key={request.id} style={styles.requestCard}>
          <View style={styles.requestHeader}>
            <Text style={styles.requestAmount}>{formatCurrency(request.amount)}</Text>
            <Text style={[styles.statusBadge, styles[`status${request.status}`]]}>
              {request.status}
            </Text>
          </View>
          <Text>Reason: {request.reason}</Text>
        </View>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Employee Dashboard</Text>
        <Text style={styles.welcomeText}>Welcome, {user.username}</Text>
      </View>

      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'overview' && styles.activeTab]}
          onPress={() => setActiveTab('overview')}
        >
          <Text style={[styles.tabText, activeTab === 'overview' && styles.activeTabText]}>
            Overview
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'leave' && styles.activeTab]}
          onPress={() => setActiveTab('leave')}
        >
          <Text style={[styles.tabText, activeTab === 'leave' && styles.activeTabText]}>
            Leave
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'advance' && styles.activeTab]}
          onPress={() => setActiveTab('advance')}
        >
          <Text style={[styles.tabText, activeTab === 'advance' && styles.activeTabText]}>
            Advance
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'leave' && renderLeaveRequests()}
        {activeTab === 'advance' && renderAdvanceRequests()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#007bff',
    padding: 20,
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  welcomeText: {
    fontSize: 16,
    color: 'white',
    marginTop: 5,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tab: {
    flex: 1,
    padding: 15,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#007bff',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#007bff',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 15,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#28a745',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  salaryCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  salaryMonth: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  salaryAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#28a745',
    marginBottom: 10,
  },
  salaryDetail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  requestCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  requestDate: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  requestAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007bff',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  statuspending: {
    backgroundColor: '#ffc107',
    color: '#000',
  },
  statusapproved: {
    backgroundColor: '#28a745',
    color: 'white',
  },
  statusrejected: {
    backgroundColor: '#dc3545',
    color: 'white',
  },
});

export default EmployeeDashboard;