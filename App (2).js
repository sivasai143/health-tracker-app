import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, TextInput, StatusBar, FlatList
} from 'react-native';

const C = {
  bg: '#F0F7FF',
  card: '#FFFFFF',
  primary: '#2D7DD2',
  primaryLight: '#EBF4FF',
  green: '#06D6A0',
  greenLight: '#E8FDF8',
  orange: '#FF8C42',
  orangeLight: '#FFF3E9',
  red: '#EF476F',
  redLight: '#FFEEF2',
  purple: '#7B2FBE',
  purpleLight: '#F3E8FF',
  text: '#1A1A2E',
  subtext: '#6B7280',
  border: '#E5E7EB',
};

const TABS = ['Dashboard', 'Log', 'History', 'Goals'];

const INITIAL_LOGS = [
  { id: '1', date: 'Today', steps: 8420, water: 6, sleep: 7.5, calories: 1850, mood: '😊' },
  { id: '2', date: 'Yesterday', steps: 10200, water: 8, sleep: 8, calories: 2100, mood: '😄' },
  { id: '3', date: 'Mon', steps: 5600, water: 5, sleep: 6.5, calories: 1700, mood: '😐' },
];

export default function App() {
  const [tab, setTab] = useState('Dashboard');
  const [logs, setLogs] = useState(INITIAL_LOGS);
  const [form, setForm] = useState({ steps: '', water: '', sleep: '', calories: '', mood: '😊' });
  const today = logs[0];

  const submitLog = () => {
    if (!form.steps && !form.water) return;
    const newLog = {
      id: Date.now().toString(),
      date: 'New Entry',
      steps: parseInt(form.steps) || 0,
      water: parseInt(form.water) || 0,
      sleep: parseFloat(form.sleep) || 0,
      calories: parseInt(form.calories) || 0,
      mood: form.mood,
    };
    setLogs([newLog, ...logs]);
    setForm({ steps: '', water: '', sleep: '', calories: '', mood: '😊' });
    setTab('History');
  };

  return (
    <SafeAreaView style={s.container}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />

      {/* Header */}
      <View style={s.header}>
        <View>
          <Text style={s.headerSub}>Good morning 🌅</Text>
          <Text style={s.headerTitle}>Health Tracker</Text>
        </View>
        <View style={s.avatarCircle}>
          <Text style={{ fontSize: 22 }}>🏃</Text>
        </View>
      </View>

      {/* Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.tabsRow}>
        {TABS.map(t => (
          <TouchableOpacity key={t} style={[s.tabBtn, tab === t && s.tabBtnActive]} onPress={() => setTab(t)}>
            <Text style={[s.tabText, tab === t && s.tabTextActive]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        {tab === 'Dashboard' && <Dashboard today={today} />}
        {tab === 'Log' && <LogForm form={form} setForm={setForm} onSubmit={submitLog} />}
        {tab === 'History' && <History logs={logs} />}
        {tab === 'Goals' && <Goals today={today} />}
        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function Dashboard({ today }) {
  const metrics = [
    { label: 'Steps', value: today.steps.toLocaleString(), goal: '10,000', icon: '👣', color: C.primary, bg: C.primaryLight, pct: today.steps / 10000 },
    { label: 'Water', value: `${today.water} glasses`, goal: '8 glasses', icon: '💧', color: C.green, bg: C.greenLight, pct: today.water / 8 },
    { label: 'Sleep', value: `${today.sleep}h`, goal: '8 hours', icon: '😴', color: C.purple, bg: C.purpleLight, pct: today.sleep / 8 },
    { label: 'Calories', value: today.calories.toLocaleString(), goal: '2,000 kcal', icon: '🔥', color: C.orange, bg: C.orangeLight, pct: today.calories / 2000 },
  ];

  return (
    <View style={s.tabContent}>
      {/* Mood Banner */}
      <View style={s.moodBanner}>
        <Text style={s.moodText}>Today's mood: {today.mood}</Text>
        <Text style={s.moodSub}>Keep up the great work!</Text>
      </View>

      {/* Metric Cards */}
      {metrics.map((m, i) => (
        <View key={i} style={[s.metricCard, { borderLeftColor: m.color }]}>
          <View style={[s.metricIcon, { backgroundColor: m.bg }]}>
            <Text style={{ fontSize: 24 }}>{m.icon}</Text>
          </View>
          <View style={s.metricInfo}>
            <Text style={s.metricLabel}>{m.label}</Text>
            <Text style={s.metricValue}>{m.value}</Text>
            <View style={s.progressBg}>
              <View style={[s.progressFill, { width: `${Math.min(m.pct * 100, 100)}%`, backgroundColor: m.color }]} />
            </View>
            <Text style={s.metricGoal}>Goal: {m.goal}</Text>
          </View>
          <Text style={[s.metricPct, { color: m.color }]}>{Math.round(m.pct * 100)}%</Text>
        </View>
      ))}

      {/* Weekly Summary */}
      <Text style={s.sectionTitle}>This Week</Text>
      <View style={s.weekRow}>
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
          <View key={i} style={s.dayCol}>
            <View style={[s.dayBar, { height: [60, 90, 45, 80, 100, 30, 70][i], backgroundColor: i === 4 ? C.primary : C.border }]} />
            <Text style={s.dayLabel}>{d}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function LogForm({ form, setForm, onSubmit }) {
  const moods = ['😊', '😄', '😐', '😴', '💪', '😓'];
  const fields = [
    { key: 'steps', label: 'Steps Walked', icon: '👣', placeholder: 'e.g. 8000', keyboard: 'numeric' },
    { key: 'water', label: 'Water (glasses)', icon: '💧', placeholder: 'e.g. 6', keyboard: 'numeric' },
    { key: 'sleep', label: 'Sleep (hours)', icon: '😴', placeholder: 'e.g. 7.5', keyboard: 'decimal-pad' },
    { key: 'calories', label: 'Calories', icon: '🔥', placeholder: 'e.g. 1800', keyboard: 'numeric' },
  ];

  return (
    <View style={s.tabContent}>
      <Text style={s.formTitle}>Log Today's Health 📋</Text>

      {fields.map(f => (
        <View key={f.key} style={s.inputGroup}>
          <Text style={s.inputLabel}>{f.icon} {f.label}</Text>
          <TextInput
            style={s.input}
            placeholder={f.placeholder}
            placeholderTextColor={C.subtext}
            keyboardType={f.keyboard}
            value={form[f.key]}
            onChangeText={v => setForm({ ...form, [f.key]: v })}
          />
        </View>
      ))}

      <Text style={s.inputLabel}>😊 How are you feeling?</Text>
      <View style={s.moodRow}>
        {moods.map(m => (
          <TouchableOpacity
            key={m}
            style={[s.moodBtn, form.mood === m && s.moodBtnActive]}
            onPress={() => setForm({ ...form, mood: m })}
          >
            <Text style={{ fontSize: 28 }}>{m}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={s.submitBtn} onPress={onSubmit}>
        <Text style={s.submitText}>Save Today's Log ✓</Text>
      </TouchableOpacity>
    </View>
  );
}

function History({ logs }) {
  return (
    <View style={s.tabContent}>
      <Text style={s.formTitle}>Activity History 📅</Text>
      {logs.map(log => (
        <View key={log.id} style={s.historyCard}>
          <View style={s.historyHeader}>
            <Text style={s.historyDate}>{log.date}</Text>
            <Text style={{ fontSize: 22 }}>{log.mood}</Text>
          </View>
          <View style={s.historyStats}>
            <View style={s.historyStat}>
              <Text style={s.historyStatVal}>{log.steps.toLocaleString()}</Text>
              <Text style={s.historyStatLabel}>👣 Steps</Text>
            </View>
            <View style={s.historyStat}>
              <Text style={s.historyStatVal}>{log.water}</Text>
              <Text style={s.historyStatLabel}>💧 Water</Text>
            </View>
            <View style={s.historyStat}>
              <Text style={s.historyStatVal}>{log.sleep}h</Text>
              <Text style={s.historyStatLabel}>😴 Sleep</Text>
            </View>
            <View style={s.historyStat}>
              <Text style={s.historyStatVal}>{log.calories}</Text>
              <Text style={s.historyStatLabel}>🔥 kcal</Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}

function Goals({ today }) {
  const goals = [
    { label: 'Walk 10,000 steps daily', done: today.steps >= 10000, icon: '👣' },
    { label: 'Drink 8 glasses of water', done: today.water >= 8, icon: '💧' },
    { label: 'Sleep 8 hours', done: today.sleep >= 8, icon: '😴' },
    { label: 'Stay under 2000 calories', done: today.calories <= 2000, icon: '🔥' },
    { label: 'Log mood daily', done: true, icon: '😊' },
  ];

  const completed = goals.filter(g => g.done).length;

  return (
    <View style={s.tabContent}>
      <Text style={s.formTitle}>My Goals 🎯</Text>

      <View style={s.goalsBanner}>
        <Text style={s.goalsScore}>{completed}/{goals.length}</Text>
        <Text style={s.goalsSub}>Goals completed today</Text>
        <View style={s.goalsProgressBg}>
          <View style={[s.goalsProgressFill, { width: `${(completed / goals.length) * 100}%` }]} />
        </View>
      </View>

      {goals.map((g, i) => (
        <View key={i} style={[s.goalCard, g.done && s.goalCardDone]}>
          <Text style={{ fontSize: 24 }}>{g.icon}</Text>
          <Text style={[s.goalText, g.done && s.goalTextDone]}>{g.label}</Text>
          <Text style={{ fontSize: 20 }}>{g.done ? '✅' : '⬜'}</Text>
        </View>
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
  headerSub: { color: C.subtext, fontSize: 13 },
  headerTitle: { color: C.text, fontSize: 24, fontWeight: '800' },
  avatarCircle: { width: 46, height: 46, borderRadius: 23, backgroundColor: C.primaryLight, alignItems: 'center', justifyContent: 'center' },
  tabsRow: { paddingLeft: 16, marginBottom: 8, maxHeight: 50 },
  tabBtn: { paddingVertical: 8, paddingHorizontal: 18, marginRight: 8, borderRadius: 20, backgroundColor: C.card },
  tabBtnActive: { backgroundColor: C.primary },
  tabText: { color: C.subtext, fontWeight: '600', fontSize: 14 },
  tabTextActive: { color: '#fff' },
  tabContent: { padding: 16 },
  moodBanner: { backgroundColor: C.primary, borderRadius: 16, padding: 18, marginBottom: 16 },
  moodText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  moodSub: { color: 'rgba(255,255,255,0.75)', fontSize: 13, marginTop: 4 },
  metricCard: { backgroundColor: C.card, borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', marginBottom: 12, borderLeftWidth: 4, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  metricIcon: { width: 52, height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  metricInfo: { flex: 1 },
  metricLabel: { color: C.subtext, fontSize: 12, fontWeight: '600' },
  metricValue: { color: C.text, fontSize: 18, fontWeight: '800', marginTop: 2 },
  progressBg: { height: 4, backgroundColor: C.border, borderRadius: 2, marginTop: 8 },
  progressFill: { height: 4, borderRadius: 2 },
  metricGoal: { color: C.subtext, fontSize: 11, marginTop: 4 },
  metricPct: { fontSize: 14, fontWeight: '700', marginLeft: 8 },
  sectionTitle: { color: C.text, fontSize: 17, fontWeight: '700', marginTop: 8, marginBottom: 12 },
  weekRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end', backgroundColor: C.card, borderRadius: 16, padding: 16, height: 130 },
  dayCol: { alignItems: 'center', justifyContent: 'flex-end' },
  dayBar: { width: 24, borderRadius: 4, marginBottom: 6 },
  dayLabel: { color: C.subtext, fontSize: 12 },
  formTitle: { color: C.text, fontSize: 20, fontWeight: '800', marginBottom: 16 },
  inputGroup: { marginBottom: 14 },
  inputLabel: { color: C.text, fontSize: 14, fontWeight: '600', marginBottom: 6 },
  input: { backgroundColor: C.card, borderRadius: 12, padding: 14, color: C.text, fontSize: 15, borderWidth: 1, borderColor: C.border },
  moodRow: { flexDirection: 'row', gap: 10, marginTop: 6, marginBottom: 20 },
  moodBtn: { width: 50, height: 50, borderRadius: 12, backgroundColor: C.card, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: C.border },
  moodBtnActive: { borderColor: C.primary, backgroundColor: C.primaryLight },
  submitBtn: { backgroundColor: C.primary, borderRadius: 14, padding: 18, alignItems: 'center' },
  submitText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  historyCard: { backgroundColor: C.card, borderRadius: 16, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 },
  historyHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  historyDate: { color: C.text, fontSize: 16, fontWeight: '700' },
  historyStats: { flexDirection: 'row', justifyContent: 'space-around' },
  historyStat: { alignItems: 'center' },
  historyStatVal: { color: C.text, fontSize: 16, fontWeight: '800' },
  historyStatLabel: { color: C.subtext, fontSize: 11, marginTop: 2 },
  goalsBanner: { backgroundColor: C.green, borderRadius: 16, padding: 20, marginBottom: 16, alignItems: 'center' },
  goalsScore: { color: '#fff', fontSize: 40, fontWeight: '900' },
  goalsSub: { color: 'rgba(255,255,255,0.85)', fontSize: 14, marginTop: 4 },
  goalsProgressBg: { height: 6, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 3, width: '100%', marginTop: 14 },
  goalsProgressFill: { height: 6, backgroundColor: '#fff', borderRadius: 3 },
  goalCard: { backgroundColor: C.card, borderRadius: 14, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
  goalCardDone: { backgroundColor: C.greenLight },
  goalText: { flex: 1, color: C.text, fontSize: 14, fontWeight: '600' },
  goalTextDone: { color: C.green },
});
