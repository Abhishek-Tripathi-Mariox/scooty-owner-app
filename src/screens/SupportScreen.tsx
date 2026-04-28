import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { AppBackground } from '../components/AppBackground';
import { BottomTabs, type TabKey } from '../components/BottomTabs';
import { GradientButton } from '../components/GradientButton';
import {
  ArrowLeftIcon,
  ChevronDownIcon,
  MailIcon,
  MessageIcon,
  PhoneCallIcon,
  SendIcon,
} from '../components/OwnerIcons';
import { SupportFaq } from '../services/ownerApi';

function GradientHeaderBg() {
  return (
    <Svg width="100%" height="100%">
      <Defs>
        <LinearGradient id="supportHeaderGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <Stop offset="0%" stopColor="#fc4c02" stopOpacity={1} />
          <Stop offset="100%" stopColor="#ff7a45" stopOpacity={1} />
        </LinearGradient>
      </Defs>
      <Rect width="100%" height="100%" fill="url(#supportHeaderGrad)" />
    </Svg>
  );
}

function QuickAction({
  icon,
  label,
  onPress,
}: {
  icon: React.ReactNode;
  label: string;
  onPress?: () => void;
}) {
  return (
    <Pressable style={styles.quickAction} onPress={onPress}>
      <View style={styles.quickActionIconCircle}>{icon}</View>
      <Text style={styles.quickActionLabel}>{label}</Text>
    </Pressable>
  );
}

function FaqItem({ question, answer }: { question: string; answer?: string }) {
  const [open, setOpen] = useState(false);
  const hasAnswer = !!answer;
  return (
    <Pressable style={styles.faqItem} onPress={() => hasAnswer && setOpen((v) => !v)}>
      <View style={styles.faqTopRow}>
        <Text style={styles.faqText}>{question}</Text>
        <ChevronDownIcon size={20} color="#64748b" />
      </View>
      {open && hasAnswer ? <Text style={styles.faqAnswer}>{answer}</Text> : null}
    </Pressable>
  );
}

export function SupportScreen({
  onBack,
  faqs = [],
  subject,
  message,
  onChangeSubject,
  onChangeMessage,
  onSubmitTicket,
  loading = false,
  onTabPress,
}: {
  onBack: () => void;
  faqs?: SupportFaq[];
  tickets?: unknown[];
  subject: string;
  message: string;
  onChangeSubject: (value: string) => void;
  onChangeMessage: (value: string) => void;
  onSubmitTicket: () => void;
  loading?: boolean;
  onTabPress?: (tab: TabKey) => void;
}) {
  return (
    <View style={styles.root}>
      <AppBackground variant="auth" />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          automaticallyAdjustKeyboardInsets
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View style={StyleSheet.absoluteFill}>
              <GradientHeaderBg />
            </View>
            <View style={styles.headerTopRow}>
              <Pressable onPress={onBack} style={styles.back} hitSlop={10}>
                <ArrowLeftIcon size={24} color="#ffffff" />
              </Pressable>
              <Text style={styles.headerTitle}>Support</Text>
            </View>
            <View style={styles.quickActionsRow}>
              <QuickAction icon={<PhoneCallIcon size={20} color="#fc4c02" />} label="Call" />
              <QuickAction icon={<MailIcon size={20} color="#fc4c02" />} label="Email" />
              <QuickAction icon={<MessageIcon size={20} color="#fc4c02" />} label="Chat" />
            </View>
          </View>

          <View style={styles.body}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
              <View style={styles.faqList}>
                {faqs.length > 0 ? (
                  faqs.map((item) => (
                    <FaqItem key={item.id} question={item.question} answer={item.answer} />
                  ))
                ) : (
                  <View style={styles.emptyFaqCard}>
                    <Text style={styles.emptyFaqTitle}>No FAQs available yet</Text>
                    <Text style={styles.emptyFaqText}>
                      The support team has not published any FAQ entries for this account yet.
                    </Text>
                  </View>
                )}
              </View>
            </View>

            <View style={styles.ticketCard}>
              <Text style={styles.sectionTitle}>Raise a Ticket</Text>
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Subject</Text>
                <TextInput
                  value={subject}
                  onChangeText={onChangeSubject}
                  placeholder="Brief description of your issue"
                  placeholderTextColor="#64748b"
                  style={styles.input}
                />
              </View>
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Message</Text>
                <TextInput
                  value={message}
                  onChangeText={onChangeMessage}
                  placeholder="Describe your issue in detail..."
                  placeholderTextColor="#64748b"
                  style={[styles.input, styles.messageInput]}
                  multiline
                  textAlignVertical="top"
                />
              </View>
              <GradientButton
                label={loading ? 'Submitting...' : 'Submit Ticket'}
                onPress={onSubmitTicket}
                disabled={loading}
                height={48}
                radius={12}
                leftIcon={<SendIcon size={16} color="#ffffff" />}
              />
            </View>

            <View style={styles.infoCard}>
              <Text style={styles.infoTitle}>24/7 Support Available</Text>
              <Text style={styles.infoText}>
                Our support team is available round the clock to help you with any queries or
                issues.
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <BottomTabs active="profile" onTabPress={onTabPress ?? (() => undefined)} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: 'transparent' },
  flex: { flex: 1 },
  scrollContent: {
    paddingBottom: 120,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: 'hidden',
    gap: 24,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  back: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 32,
  },
  quickActionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  quickAction: {
    flex: 1,
    height: 96,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  quickActionIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionLabel: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
  },
  body: {
    paddingHorizontal: 24,
    paddingTop: 24,
    gap: 24,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    color: '#0f172a',
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 28,
  },
  faqList: {
    gap: 12,
  },
  emptyFaqCard: {
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.62)',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 6,
  },
  emptyFaqTitle: {
    color: '#0f172a',
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 22,
  },
  emptyFaqText: {
    color: '#64748b',
    fontSize: 13,
    lineHeight: 20,
  },
  faqItem: {
    minHeight: 56,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.62)',
    paddingHorizontal: 17,
    paddingVertical: 16,
    justifyContent: 'center',
  },
  faqTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  faqText: {
    flex: 1,
    color: '#0f172a',
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
  },
  faqAnswer: {
    marginTop: 8,
    color: '#64748b',
    fontSize: 14,
    lineHeight: 20,
  },
  ticketCard: {
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.62)',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 24,
    gap: 16,
  },
  fieldGroup: {
    gap: 8,
  },
  label: {
    color: '#0f172a',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 14,
  },
  input: {
    minHeight: 36,
    borderRadius: 10,
    borderWidth: 1.162,
    borderColor: '#e2e8f0',
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: '#0f172a',
    fontSize: 16,
  },
  messageInput: {
    minHeight: 64,
  },
  infoCard: {
    borderRadius: 16,
    borderWidth: 1.162,
    borderColor: '#e2e8f0',
    paddingHorizontal: 17,
    paddingVertical: 17,
    gap: 8,
  },
  infoTitle: {
    color: '#0f172a',
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
  },
  infoText: {
    color: '#64748b',
    fontSize: 14,
    lineHeight: 20,
  },
});
