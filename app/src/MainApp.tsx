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
import { TeamScreen } from './screens/TeamScreen';
import { TradeScreen } from './screens/TradeScreen';
import { TransactionsScreen } from './screens/TransactionsScreen';
import { VerifyingDepositScreen } from './screens/VerifyingDepositScreen';
import { VipPlansScreen } from './screens/VipPlansScreen';
import { WithdrawScreen } from './screens/WithdrawScreen';
import { colors } from './theme/colors';

type WalletStep = 'deposit' | 'txid' | 'verifying' | 'success';
type Overlay =
  | 'withdraw'
  | 'security'
  | 'support'
  | 'about'
  | 'transactions'
  | 'team';

type WithdrawRequest = {
  amount: number;
  network: string;
};

const OVERLAY_SCREENS = {
  security: SecurityScreen,
  support: SupportScreen,
  about: AboutScreen,
  team: TeamScreen,
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
  const [depositAmount, setDepositAmount] = useState('');
  const [overlay, setOverlay] = useState<Overlay | null>(null);
  const [overlayReturn, setOverlayReturn] = useState<Overlay | null>(null);
  const [withdrawRequest, setWithdrawRequest] =
    useState<WithdrawRequest | null>(null);

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

  let screen = (
    <HomeScreen
      userName={userName}
      onOpenPlans={() => setTab('plans')}
      onOpenDeposit={() => {
        setDepositAmount('');
        setWalletStep('deposit');
      }}
      onOpenWithdraw={() => setOverlay('withdraw')}
      onOpenAssets={() => setTab('assets')}
      onOpenTransactions={() => openTransactions()}
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
          if (key === 'transactions') openTransactions();
          if (key === 'security') setOverlay('security');
          if (key === 'support') setOverlay('support');
          if (key === 'about') setOverlay('about');
          if (key === 'referral') setOverlay('team');
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
