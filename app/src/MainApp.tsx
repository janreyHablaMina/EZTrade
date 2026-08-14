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
import { SubmitTxidScreen } from './screens/SubmitTxidScreen';
import { TradeScreen } from './screens/TradeScreen';
import { TransactionsScreen } from './screens/TransactionsScreen';
import { VerifyingDepositScreen } from './screens/VerifyingDepositScreen';
import { SecurityScreen } from './screens/SecurityScreen';
import { SupportScreen } from './screens/SupportScreen';
import { WithdrawScreen } from './screens/WithdrawScreen';
import { colors } from './theme/colors';

type WalletStep = 'deposit' | 'txid' | 'verifying' | 'success';

type MainAppProps = {
  userName?: string;
  onOpenPlans?: () => void;
  onLogout?: () => void;
};

export function MainApp({
  userName = 'John Doe',
  onOpenPlans,
  onLogout,
}: MainAppProps) {
  const [tab, setTab] = useState<TabKey>('home');
  const [walletStep, setWalletStep] = useState<WalletStep | null>(null);
  const [depositNetwork, setDepositNetwork] = useState('TRC20 (USDT)');
  const [showTransactions, setShowTransactions] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [showSecurity, setShowSecurity] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  const hideTabs =
    Boolean(walletStep) ||
    showTransactions ||
    showWithdraw ||
    showSecurity ||
    showSupport ||
    showAbout;

  let screen = (
    <HomeScreen
      userName={userName}
      onOpenPlans={onOpenPlans}
      onOpenDeposit={() => setWalletStep('deposit')}
      onOpenWithdraw={() => setShowWithdraw(true)}
      onOpenAssets={() => setTab('assets')}
      onOpenTransactions={() => setShowTransactions(true)}
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
  } else if (showWithdraw) {
    screen = <WithdrawScreen onBack={() => setShowWithdraw(false)} />;
  } else if (showSecurity) {
    screen = <SecurityScreen onBack={() => setShowSecurity(false)} />;
  } else if (showSupport) {
    screen = <SupportScreen onBack={() => setShowSupport(false)} />;
  } else if (showAbout) {
    screen = <AboutScreen onBack={() => setShowAbout(false)} />;
  } else if (showTransactions) {
    screen = (
      <TransactionsScreen onBack={() => setShowTransactions(false)} />
    );
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
          if (key === 'plans') onOpenPlans?.();
          if (key === 'transactions') setShowTransactions(true);
          if (key === 'security') setShowSecurity(true);
          if (key === 'support') setShowSupport(true);
          if (key === 'about') setShowAbout(true);
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
          onChange={(next) => {
            if (next === 'plans') {
              onOpenPlans?.();
              return;
            }
            setTab(next);
          }}
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
