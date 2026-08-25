import { StatusBar } from 'expo-status-bar';
import { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Alert, Platform } from 'react-native';
import {
  BottomTabBar,
  type TabKey,
} from './components/BottomTabBar';
import { NebulaBackground } from './components/NebulaBackground';
import { AboutScreen } from './screens/AboutScreen';
import { AssetsScreen } from './screens/AssetsScreen';
import { DepositScreen } from './screens/DepositScreen';
import { DepositSuccessScreen } from './screens/DepositSuccessScreen';
import { HomeScreen } from './screens/HomeScreen';
import { NotificationsScreen } from './screens/NotificationsScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { SecurityScreen } from './screens/SecurityScreen';
import { SubmitTxidScreen } from './screens/SubmitTxidScreen';
import { SupportScreen } from './screens/SupportScreen';
import { TeamScreen } from './screens/TeamScreen';
import { TradeScreen } from './screens/TradeScreen';
import { TransactionsScreen } from './screens/TransactionsScreen';
import { VerifyingDepositScreen } from './screens/VerifyingDepositScreen';
import { VipPlansScreen } from './screens/VipPlansScreen';
import { WithdrawScreen } from './screens/WithdrawScreen';
import { colors } from './theme/colors';
import { apiClient } from './lib/api';

const LOCAL_API_URL = 'http://192.168.254.104:8000';

type WalletStep = 'deposit' | 'txid' | 'verifying' | 'success';
type Overlay =
  | 'withdraw'
  | 'security'
  | 'support'
  | 'about'
  | 'transactions'
  | 'messages'
  | 'team';

type WithdrawRequest = {
  amount: number;
  network: string;
};

import { MessagesScreen } from './screens/MessagesScreen';

const OVERLAY_SCREENS = {
  security: SecurityScreen,
  support: SupportScreen,
  about: AboutScreen,
  team: TeamScreen,
} as const;

type MainAppProps = {
  user?: any;
  onLogout?: () => void;
};

export function MainApp({
  user,
  onLogout,
}: MainAppProps) {
  const userName = user?.name || 'John Doe';
  const [tab, setTab] = useState<TabKey>('home');
  const [walletStep, setWalletStep] = useState<WalletStep | null>(null);
  const [depositNetwork, setDepositNetwork] = useState('TRC20 (USDT)');
  const [depositAmount, setDepositAmount] = useState('');
  const [overlay, setOverlay] = useState<Overlay | null>(null);
  const [overlayReturn, setOverlayReturn] = useState<Overlay | null>(null);
  const [withdrawRequest, setWithdrawRequest] =
    useState<WithdrawRequest | null>(null);
  const [systemSettings, setSystemSettings] = useState<any>(null);
  const [isMaintenance, setIsMaintenance] = useState(false);

  const lastSeenNotifRef = useRef<string | null>(null);

  useEffect(() => {
    // Fetch global system settings on boot
    apiClient.get('/settings/system')
      .then((data: any) => {
        setSystemSettings(data);
        if (data?.platform_controls?.maintenance_mode) {
          setIsMaintenance(true);
        }
      })
      .catch(console.error);
  }, []);

  // Poll for real-time push notifications from Admin
  useEffect(() => {
    // Initial fetch to get the current state silently
    fetch(`${LOCAL_API_URL}/api/notifications`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.id) lastSeenNotifRef.current = data.id;
      })
      .catch(() => {}); // Ignore network errors initially

    const intervalId = setInterval(async () => {
      try {
        const response = await fetch(`${LOCAL_API_URL}/api/notifications`);
        if (!response.ok) return;
        
        const data = await response.json();
        if (data && data.id && data.id !== lastSeenNotifRef.current) {
          lastSeenNotifRef.current = data.id;
          Alert.alert(data.title, data.message, [{ text: 'Dismiss' }]);
        }
      } catch (err) {
        // Silently fail if server is down or unreachable
      }
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const closeOverlay = () => {
    if (overlayReturn) {
      setOverlay(overlayReturn);
      setOverlayReturn(null);
      return;
    }
    setOverlay(null);
  };

  const openTransactions = (from?: Overlay) => {
    setOverlayReturn(from ?? null);
    setOverlay('transactions');
  };
  const hideTabs = Boolean(walletStep) || overlay !== null;

  if (isMaintenance) {
    return (
      <View style={{ flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center', padding: 24 }}>
        <Text style={{ color: '#fff', fontSize: 24, fontWeight: 'bold', marginBottom: 12 }}>Under Maintenance</Text>
        <Text style={{ color: '#A0A0A0', fontSize: 16, textAlign: 'center', lineHeight: 24 }}>
          We are currently performing scheduled maintenance to improve the platform. Please check back later.
        </Text>
      </View>
    );
  }

  let screen = (
    <HomeScreen
      user={user}
      systemSettings={systemSettings}
      onOpenPlans={() => setTab('plans')}
      onOpenNotifications={() => setTab('notifications')}
      onOpenDeposit={() => {
        setDepositAmount('');
        setWalletStep('deposit');
      }}
      onOpenWithdraw={() => setOverlay('withdraw')}
      onOpenAssets={() => setTab('assets')}
      onOpenTransactions={() => openTransactions()}
      onOpenMessages={() => setOverlay('messages')}
    />
  );

  if (walletStep === 'deposit') {
    screen = (
      <DepositScreen
        amount={depositAmount}
        onBack={() => setWalletStep(null)}
        onSentPayment={(networkLabel, amount) => {
          setDepositNetwork(networkLabel);
          setDepositAmount(amount);
          setWalletStep('txid');
        }}
      />
    );
  } else if (walletStep === 'txid') {
    screen = (
      <SubmitTxidScreen
        amount={depositAmount}
        networkLabel={depositNetwork}
        onBack={() => setWalletStep(null)}
        onSubmit={async (txid) => {
          try {
            await apiClient.post('/deposits', {
              user_id: user?.id,
              amount: parseFloat(depositAmount.replace(/[^0-9.]/g, '') || '0'),
              network: depositNetwork,
              txid: txid,
            });
            setWalletStep('verifying');
          } catch (e) {
            console.error('Failed to submit deposit', e);
            Alert.alert('Error', 'Failed to submit deposit.');
          }
        }}
      />
    );
  } else if (walletStep === 'verifying') {
    screen = (
      <VerifyingDepositScreen
        onBack={() => setWalletStep(null)}
        onComplete={() => setWalletStep('success')}
      />
    );
  } else if (walletStep === 'success') {
    screen = (
      <DepositSuccessScreen
        amount={depositAmount}
        onGoDashboard={() => {
          setWalletStep(null);
          setTab('home');
        }}
      />
    );
  } else if (overlay === 'withdraw') {
    screen = (
      <WithdrawScreen
        onBack={() => setOverlay(null)}
        request={withdrawRequest}
        onRequested={setWithdrawRequest}
        onViewStatus={() => openTransactions('withdraw')}
        systemSettings={systemSettings}
      />
    );
  } else if (overlay === 'transactions') {
    screen = (
      <TransactionsScreen
        onBack={closeOverlay}
        initialFilter={overlayReturn === 'withdraw' ? 'Withdraw' : 'All'}
        pendingWithdraw={withdrawRequest}
      />
    );
  } else if (overlay === 'messages') {
    screen = <MessagesScreen user={user} onBack={closeOverlay} />;
  } else if (overlay) {
    const OverlayScreen = OVERLAY_SCREENS[overlay];
    screen = <OverlayScreen onBack={closeOverlay} />;
  } else if (tab === 'assets') {
    screen = <AssetsScreen user={user} onBack={() => setTab('home')} />;
  } else if (tab === 'profile') {
    screen = (
      <ProfileScreen
        user={user}
        onBack={() => setTab('home')}
        onLogout={onLogout}
        onOpenMenu={(key) => {
          if (key === 'assets') setTab('assets');
          if (key === 'plans') setTab('plans');
          if (key === 'transactions') openTransactions();
          if (key === 'security') setOverlay('security');
          if (key === 'support') setOverlay('messages');
          if (key === 'about') setOverlay('about');
          if (key === 'referral') setOverlay('team');
        }}
      />
    );
  } else if (tab === 'plans') {
    screen = (
      <VipPlansScreen
        user={user}
        onBack={() => setTab('home')}
      />
    );
  } else if (tab === 'trade') {
    screen = <TradeScreen user={user} onBack={() => setTab('home')} />;
  } else if (tab === 'notifications') {
    screen = (
      <NotificationsScreen user={user} onBack={() => setTab('home')} />
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <NebulaBackground />
      {screen}
      {hideTabs ? null : (
        <BottomTabBar
          active={tab}
          onChange={setTab}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
});
