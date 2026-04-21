import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { PageFrame } from '../components/PageFrame';
import { COLORS } from '../constants/theme';
import { SupportFaq, SupportTicket } from '../services/ownerApi';
import { formatShortDate } from '../utils/format';

function FaqItem({ question, answer }: { question: string; answer?: string }) {
  return (
    <View style={styles.faqItem}>
      <View style={styles.faqCopy}>
        <Text style={styles.faqText}>{question}</Text>
        {answer ? <Text style={styles.faqAnswer}>{answer}</Text> : null}
      </View>
      <Text style={styles.faqArrow}>⌄</Text>
    </View>
  );
}

function RecentTicketItem({ ticket }: { ticket: SupportTicket }) {
  const status = (ticket.status || 'open').toLowerCase();
  const statusLabel = status.replace(/_/g, ' ');
  const statusStyle =
    status === 'resolved'
      ? styles.ticketStatusResolved
      : status === 'open'
        ? styles.ticketStatusOpen
        : styles.ticketStatusPending;

  return (
    <View style={styles.recentTicketItem}>
      <View style={styles.recentTicketIcon}>
        <Text style={styles.recentTicketIconText}>•</Text>
      </View>
      <View style={styles.recentTicketCopy}>
        <Text style={styles.recentTicketTitle} numberOfLines={1}>
          {ticket.subject || 'Support ticket'}
        </Text>
        <Text style={styles.recentTicketMeta} numberOfLines={1}>
          {formatShortDate(ticket.createdAt) || 'Recently submitted'}
        </Text>
      </View>
      <View style={[styles.ticketStatusPill, statusStyle]}>
        <Text style={styles.ticketStatusText}>{statusLabel}</Text>
      </View>
    </View>
  );
}

export function SupportScreen({
  onBack,
  faqs = [],
  tickets = [],
  subject,
  message,
  onChangeSubject,
  onChangeMessage,
  onSubmitTicket,
  loading = false,
}: {
  onBack: () => void;
  faqs?: SupportFaq[];
  tickets?: SupportTicket[];
  subject: string;
  message: string;
  onChangeSubject: (value: string) => void;
  onChangeMessage: (value: string) => void;
  onSubmitTicket: () => void;
  loading?: boolean;
}) {
  return (
    <PageFrame
      title="Support"
      onBack={onBack}
      topRight={<Text style={styles.topRightText}>Call</Text>}
      scroll
    >
      <View style={styles.hero}>
        <View style={styles.heroAction}>
          <View style={styles.heroIconWrap}>
            <Text style={styles.heroIcon}>📞</Text>
          </View>
          <Text style={styles.heroLabel}>Call</Text>
        </View>
        <View style={styles.heroAction}>
          <View style={styles.heroIconWrap}>
            <Text style={styles.heroIcon}>✉</Text>
          </View>
          <Text style={styles.heroLabel}>Email</Text>
        </View>
        <View style={styles.heroAction}>
          <View style={styles.heroIconWrap}>
            <Text style={styles.heroIcon}>💬</Text>
          </View>
          <Text style={styles.heroLabel}>Chat</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
      {(faqs.length > 0 ? faqs : [{ id: 'fallback', question: 'How do I add a new vehicle?', answer: '' }]).map(
        (item) => (
          <FaqItem key={item.id} question={item.question} answer={item.answer} />
        ),
      )}

      <View style={styles.ticketCard}>
        <Text style={styles.ticketTitle}>Raise a Ticket</Text>
        <Text style={styles.ticketSubtitle}>Tell us what happened and we’ll get back to you quickly.</Text>
        <TextInput
          value={subject}
          onChangeText={onChangeSubject}
          placeholder="Brief description of your issue"
          placeholderTextColor="#9ca3af"
          style={styles.input}
        />
        <TextInput
          value={message}
          onChangeText={onChangeMessage}
          placeholder="Describe your issue in detail..."
          placeholderTextColor="#9ca3af"
          style={[styles.input, styles.messageInput]}
          multiline
        />
        <Pressable style={styles.button} onPress={onSubmitTicket}>
          <Text style={styles.buttonText}>{loading ? 'Submitting...' : 'Submit Ticket'}</Text>
        </Pressable>
      </View>

      <View style={styles.footerCard}>
        <Text style={styles.footerTitle}>Recent Tickets</Text>
        {tickets.length > 0 ? (
          tickets.slice(0, 3).map((ticket) => <RecentTicketItem key={ticket._id} ticket={ticket} />)
        ) : (
          <Text style={styles.footerText}>No support tickets yet.</Text>
        )}
      </View>
    </PageFrame>
  );
}

const styles = StyleSheet.create({
  topRightText: { color: COLORS.button, fontSize: 12, fontWeight: '900', letterSpacing: 0.2 },
  hero: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#ff6a1f',
    borderRadius: 26,
    padding: 12,
    marginBottom: 14,
    shadowColor: '#ff641c',
    shadowOpacity: 0.24,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
  },
  heroAction: {
    width: '31%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 16,
    paddingVertical: 14,
  },
  heroIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.14)',
    marginBottom: 7,
  },
  heroIcon: { fontSize: 17 },
  heroLabel: { color: '#fff', fontSize: 12, fontWeight: '800' },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.textPrimary,
    marginBottom: 10,
  },
  faqItem: {
    minHeight: 58,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 10,
    shadowColor: '#d9b7ab',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  faqCopy: { flex: 1, paddingRight: 10 },
  faqText: { color: COLORS.textPrimary, fontSize: 12.5, fontWeight: '800', lineHeight: 17 },
  faqAnswer: { marginTop: 4, color: COLORS.textSecondary, fontSize: 11, lineHeight: 16 },
  faqArrow: { color: COLORS.textSecondary, fontSize: 16, marginLeft: 10, marginTop: 2 },
  ticketCard: {
    marginTop: 12,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.88)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
    padding: 16,
    shadowColor: '#d9b7ab',
    shadowOpacity: 0.12,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
  },
  ticketTitle: { color: COLORS.textPrimary, fontSize: 16, fontWeight: '900' },
  ticketSubtitle: {
    marginTop: 4,
    marginBottom: 12,
    color: COLORS.textSecondary,
    fontSize: 11.5,
    lineHeight: 16,
  },
  input: {
    minHeight: 44,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e5ddd9',
    backgroundColor: 'rgba(255,255,255,0.92)',
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: COLORS.textPrimary,
    fontSize: 13,
    marginBottom: 10,
  },
  messageInput: { minHeight: 98, textAlignVertical: 'top' },
  button: {
    height: 48,
    borderRadius: 14,
    backgroundColor: COLORS.button,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#ff641c',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },
  buttonText: { color: '#fff', fontSize: 13, fontWeight: '800', letterSpacing: 0.2 },
  footerCard: {
    marginTop: 12,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.78)',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    padding: 14,
  },
  footerTitle: { color: COLORS.textPrimary, fontSize: 13, fontWeight: '900', marginBottom: 10 },
  footerText: { color: COLORS.textSecondary, fontSize: 11, lineHeight: 16 },
  recentTicketItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
  },
  recentTicketIcon: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#fff4ef',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  recentTicketIconText: {
    color: COLORS.button,
    fontSize: 18,
    fontWeight: '900',
    marginTop: -4,
  },
  recentTicketCopy: {
    flex: 1,
    paddingRight: 8,
  },
  recentTicketTitle: {
    color: COLORS.textPrimary,
    fontSize: 12.5,
    fontWeight: '800',
  },
  recentTicketMeta: {
    marginTop: 3,
    color: COLORS.textSecondary,
    fontSize: 10.5,
  },
  ticketStatusPill: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
  },
  ticketStatusText: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  ticketStatusOpen: {
    backgroundColor: 'rgba(255, 244, 239, 0.95)',
    borderColor: '#ffd7c8',
  },
  ticketStatusPending: {
    backgroundColor: 'rgba(255, 248, 233, 0.95)',
    borderColor: '#f8dca6',
  },
  ticketStatusResolved: {
    backgroundColor: 'rgba(236, 253, 245, 0.95)',
    borderColor: '#b7ebcc',
  },
});
