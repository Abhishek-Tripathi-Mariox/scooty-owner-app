import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Linking,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Svg, { Defs, LinearGradient, Path, Rect, Stop } from 'react-native-svg';
import { AppBackground } from '../components/AppBackground';
import { BottomTabs, type TabKey } from '../components/BottomTabs';
import { GradientButton } from '../components/GradientButton';
import { ArrowLeftIcon, SendIcon } from '../components/OwnerIcons';
import { SupportContact, SupportFaq } from '../services/ownerApi';

const DEFAULT_PHONE = '18001234567';
const DEFAULT_EMAIL = 'support@slydomobility.com';

function HeaderGradient() {
  return (
    <Svg width="100%" height="100%">
      <Defs>
        <LinearGradient id="supportHeaderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#fc4c02" stopOpacity={1} />
          <Stop offset="100%" stopColor="#ff7a45" stopOpacity={1} />
        </LinearGradient>
      </Defs>
      <Rect width="100%" height="100%" fill="url(#supportHeaderGrad)" />
    </Svg>
  );
}

function PhoneIcon({ color }: { color: string }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path
        d="M20.487 17.14l-4.065-3.696a1 1 0 0 0-1.391.043l-2.393 2.461c-.576-.11-1.734-.471-2.926-1.66-1.192-1.193-1.553-2.354-1.66-2.926l2.459-2.394a1 1 0 0 0 .043-1.391L6.86 3.513a1 1 0 0 0-1.391-.087l-2.396 2.06a1 1 0 0 0-.291.649c-.015.25-.301 6.172 4.291 10.766C11.479 20.892 16.5 21.25 17.883 21.25c.202 0 .326-.007.359-.009a1 1 0 0 0 .649-.292l2.06-2.396a1 1 0 0 0-.064-1.413z"
        stroke={color}
        strokeWidth={1.6}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function MailOutlineIcon({ color }: { color: string }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Rect x={2.5} y={4.5} width={19} height={15} rx={2.5} stroke={color} strokeWidth={1.6} />
      <Path d="M3 6l9 6.5L21 6" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function ChatIcon({ color }: { color: string }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path
        d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function ChevronDownIcon({ color, rotated }: { color: string; rotated: boolean }) {
  return (
    <Svg
      width={20}
      height={20}
      viewBox="0 0 20 20"
      fill="none"
      style={{ transform: [{ rotate: rotated ? '180deg' : '0deg' }] }}
    >
      <Path
        d="m5 8 5 5 5-5"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function ContactTile({
  icon,
  label,
  onPress,
}: {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.tile} onPress={onPress}>
      <View style={styles.tileIcon}>{icon}</View>
      <Text style={styles.tileLabel}>{label}</Text>
    </Pressable>
  );
}

export function SupportScreen({
  onBack,
  faqs = [],
  contact,
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
  contact?: SupportContact | null;
  tickets?: unknown[];
  subject: string;
  message: string;
  onChangeSubject: (value: string) => void;
  onChangeMessage: (value: string) => void;
  onSubmitTicket: () => void;
  loading?: boolean;
  onTabPress?: (tab: TabKey) => void;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const supportPhone = `tel:${contact?.phone || DEFAULT_PHONE}`;
  const supportEmail = `mailto:${contact?.email || DEFAULT_EMAIL}`;

  const openLink = async (url: string, fallbackMessage: string) => {
    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert('Unavailable', fallbackMessage);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <AppBackground variant="auth" />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerBlock}>
            <View style={StyleSheet.absoluteFill} pointerEvents="none">
              <HeaderGradient />
            </View>
            <View style={styles.headerRow}>
              <Pressable onPress={onBack} style={styles.backButton} hitSlop={10}>
                <ArrowLeftIcon size={24} color="#ffffff" />
              </Pressable>
              <Text style={styles.headerTitle}>Support</Text>
            </View>

            <View style={styles.tilesRow}>
              <ContactTile
                icon={<PhoneIcon color="#fc4c02" />}
                label="Call"
                onPress={() => void openLink(supportPhone, 'Calling is not available on this device.')}
              />
              <ContactTile
                icon={<MailOutlineIcon color="#fc4c02" />}
                label="Email"
                onPress={() => void openLink(supportEmail, 'No email app is available on this device.')}
              />
              <ContactTile
                icon={<ChatIcon color="#fc4c02" />}
                label="Chat"
                onPress={() =>
                  Alert.alert('Chat', 'Live chat is coming soon. Meanwhile, raise a ticket below and our team will reach out.')
                }
              />
            </View>
          </View>

          <View style={styles.body}>
            <Text style={styles.faqTitle}>Frequently Asked Questions</Text>
            <View style={{ gap: 10 }}>
              {faqs.length > 0 ? (
                faqs.map((f, i) => {
                  const open = openIndex === i;
                  const hasAnswer = !!f.answer;
                  return (
                    <View key={f.id} style={styles.faqCard}>
                      <Pressable
                        style={styles.faqRow}
                        onPress={() => hasAnswer && setOpenIndex(open ? null : i)}
                      >
                        <Text style={styles.faqQuestion}>{f.question}</Text>
                        <ChevronDownIcon color="#6b7280" rotated={open} />
                      </Pressable>
                      {open && hasAnswer ? <Text style={styles.faqAnswer}>{f.answer}</Text> : null}
                    </View>
                  );
                })
              ) : (
                <View style={styles.faqCard}>
                  <Text style={styles.faqQuestion}>No FAQs available yet</Text>
                </View>
              )}
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Raise a Ticket</Text>
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Subject</Text>
                <View style={styles.inputWrap}>
                  <TextInput
                    value={subject}
                    onChangeText={onChangeSubject}
                    placeholder="Brief description of your issue"
                    placeholderTextColor="#94a3b8"
                    style={styles.input}
                  />
                </View>
              </View>
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Message</Text>
                <View style={styles.textareaWrap}>
                  <TextInput
                    style={styles.textarea}
                    multiline
                    value={message}
                    onChangeText={onChangeMessage}
                    placeholder="Describe your issue in detail..."
                    placeholderTextColor="#94a3b8"
                    textAlignVertical="top"
                  />
                </View>
              </View>
              <GradientButton
                label={loading ? 'Submitting...' : 'Submit Ticket'}
                onPress={onSubmitTicket}
                disabled={loading}
                height={48}
                radius={14}
                leftIcon={<SendIcon size={16} color="#ffffff" />}
              />
            </View>

            <View style={styles.infoCard}>
              <Text style={styles.infoTitle}>24/7 Support Available</Text>
              <Text style={styles.infoText}>
                Our support team is available round the clock to help you with any queries or issues.
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <BottomTabs active="profile" onTabPress={onTabPress ?? (() => undefined)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  flex: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  headerBlock: {
    paddingTop: 44,
    paddingHorizontal: 16,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'hidden',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 18,
  },
  backButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 32,
  },
  tilesRow: {
    flexDirection: 'row',
    gap: 12,
  },
  tile: {
    flex: 1,
    height: 96,
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  tileIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileLabel: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  },
  body: {
    paddingHorizontal: 16,
    paddingTop: 20,
    gap: 20,
  },
  faqTitle: {
    color: '#101828',
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 28,
  },
  faqCard: {
    backgroundColor: 'rgba(255,255,255,0.45)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.62)',
    borderRadius: 16,
    paddingHorizontal: 16,
  },
  faqRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    paddingVertical: 16,
  },
  faqQuestion: {
    flex: 1,
    color: '#101828',
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 21,
  },
  faqAnswer: {
    paddingBottom: 16,
    color: '#4a5565',
    fontSize: 14,
    lineHeight: 20,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.62)',
    borderRadius: 24,
    paddingVertical: 18,
    paddingHorizontal: 18,
    gap: 14,
  },
  cardTitle: {
    color: '#101828',
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 28,
  },
  fieldGroup: {
    gap: 6,
  },
  label: {
    color: '#0f172a',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  inputWrap: {
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderWidth: 1,
    borderColor: 'rgba(226,232,240,0.9)',
    paddingHorizontal: 14,
    minHeight: 46,
    justifyContent: 'center',
  },
  input: {
    color: '#101828',
    fontSize: 15,
    lineHeight: 20,
    padding: 0,
  },
  textareaWrap: {
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderWidth: 1,
    borderColor: 'rgba(226,232,240,0.9)',
    paddingHorizontal: 14,
    paddingVertical: 12,
    minHeight: 104,
  },
  textarea: {
    flex: 1,
    color: '#101828',
    fontSize: 15,
    lineHeight: 21,
    minHeight: 80,
    padding: 0,
    textAlignVertical: 'top',
  },
  infoCard: {
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.62)',
    borderRadius: 24,
    paddingVertical: 18,
    paddingHorizontal: 18,
    gap: 6,
  },
  infoTitle: {
    color: '#101828',
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 26,
  },
  infoText: {
    color: '#64748b',
    fontSize: 14,
    lineHeight: 21,
  },
});
