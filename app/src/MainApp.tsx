import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
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
import { ProfileScreen } from './screens/ProfileScreen';
import { SecurityScreen } from './screens/SecurityScreen';
import { SubmitTxidScreen } from './screens/SubmitTxidScreen';
import { SupportScreen } from './screens/SupportScreen';
import { TradeScreen } from './screens/TradeScreen';
import { TransactionsScreen } from './screens/TransactionsScreen';
import { VerifyingDepositScreen } from './screens/VerifyingDepositScreen';
import { VipPlansScreen } from './screens/VipPlansScreen';
import { WithdrawScreen } from './screens/WithdrawScreen';
import { colors } from './theme/colors';

type WalletStep = 'deposit' | 'txid' | 'verifying' | 'success';
type Overlay = 'withdraw' | 'security' | 'support' | 'about' | 'transactions';

const OVERLAY_SCREENS = {
  withdraw: WithdrawScreen,
  security: SecurityScreen,
  support: SupportScreen,
  about: AboutScreen,
  transactions: TransactionsScreen,
} as const;

type MainAppProps = {
  userName?: string;
  onLogout?: () => void;
};

export function MainApp({
  userName = 'John Doe',
  onLogout,
}: MainAppProps) {
  const [tab, setTab] = useState<TabKey>('home');
  const [walletStep, setWalletStep] = useState<WalletStep | null>(null);
  const [depositNetwork, setDepositNetwork] = useState('TRC20 (USDT)');
  const [overlay, setOverlay] = useState<Overlay | null>(null);

  const closeOverlay = () => setOverlay(null);
  const hideTabs = Boolean(walletStep) || overlay !== null;

  let screen = (
    <HomeScreen
      userName={userName}
      onOpenPlans={() => setTab('plans')}
      onOpenDeposit={() => setWalletStep('deposit')}
      onOpenWithdraw={() => setOverlay('withdraw')}
      onOpenAssets={() => setTab('assets')}
      onOpenTransactions={() => setOverlay('transactions')}
    />
  );

  if (walletStep === 'deposit') {
    screen = (
      <DepositScreen
        onBack={() => setWalletStep(null)}
        onSentPayment={(networkLabel) => {
          setDepositNetwork(networkLabel);
          setWalletStep('txid');
        }}
      />
    );
  } else if (walletStep === 'txid') {
    screen = (
      <SubmitTxidScreen
        networkLabel={depositNetwork}
        onBack={() => setWalletStep(null)}
        onSubmit={() => setWalletStep('verifying')}
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
        onGoDashboard={() => {
          setWalletStep(null);
          setTab('home');
        }}
      />
    );
  } else if (overlay) {
    const OverlayScreen = OVERLAY_SCREENS[overlay];
    screen = <OverlayScreen onBack={closeOverlay} />;
  } else if (tab === 'assets') {
    screen = <AssetsScreen onBack={() => setTab('home')} />;
  } else if (tab === 'profile') {
    screen = (
      <ProfileScreen
        userName={userName}
        onBack={() => setTab('home')}
        onLogout={onLogout}
        onOpenMenu={(key) => {
          if (key === 'assets') setTab('assets');
          if (key === 'plans') setTab('plans');
          if (key === 'transactions') setOverlay('transactions');
          if (key === 'security') setOverlay('security');
          if (key === 'support') setOverlay('support');
          if (key === 'about') setOverlay('about');
        }}
      />
    );
  } else if (tab === 'plans') {
    screen = (
      <VipPlansScreen
        onBack={() => setTab('home')}
        onGetPlan={() => {
          // Frontend only for now
        }}
      />
    );
  } else if (tab === 'trade') {
    screen = <TradeScreen onBack={() => setTab('home')} />;
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
