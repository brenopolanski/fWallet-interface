import React, { useContext } from "react";
import { ThemeContext } from "styled-components";
import useFantomApiData from "../../hooks/useFantomApiData";
import useWalletProvider from "../../hooks/useWalletProvider";
import useFantomApi, { FantomApiMethods } from "../../hooks/useFantomApi";
import Row, { ResponsiveRow } from "../../components/Row/Row";
import Column from "../../components/Column";
import Spacer from "../../components/Spacer";
import StakingOverview from "./StakingOverview";
import Delegate from "./Delegate";
import Rewards from "./Rewards";
// import LiquidStaking from "./LiquidStaking";
import ActiveDelegations from "./ActiveDelegations";
import WithdrawRequests from "./WithdrawRequests";
import FluidRewards from "./FluidRewards";
import FadeInOut from "../../components/AnimationFade";
import ErrorBoundary from "../../components/ErrorBoundary";

const Staking: React.FC<any> = () => {
  const { breakpoints } = useContext(ThemeContext);
  const { apiData } = useFantomApiData();
  const { walletContext } = useWalletProvider();

  const activeAddress = walletContext.activeWallet.address
    ? walletContext.activeWallet.address.toLowerCase()
    : null;

  const delegations = apiData[FantomApiMethods.getDelegations];
  const accountDelegations = apiData[
    FantomApiMethods.getDelegationsForAccount
  ].get(activeAddress);
  const accountBalance = apiData[FantomApiMethods.getAccountBalance].get(
    activeAddress
  );

  const accountDelegationsIsDoneLoading =
    activeAddress && accountDelegations?.data;
  const delegateIsDoneLoading =
    activeAddress && accountBalance?.data && delegations?.data;
  const activeDelegationsIsDoneLoading =
    activeAddress && accountDelegations?.data && delegations?.data;

  useFantomApi(FantomApiMethods.getDelegations);

  useFantomApi(
    FantomApiMethods.getDelegationsForAccount,
    {
      address: activeAddress,
    },
    activeAddress,
    2000
  );

  useFantomApi(
    FantomApiMethods.getAccountBalance,
    {
      address: activeAddress,
    },
    activeAddress,
    2000
  );

  useFantomApi(
    FantomApiMethods.getAssetsListForAccount,
    {
      owner: activeAddress,
    },
    activeAddress,
    2000
  );

  return (
    <ErrorBoundary name="[Staking]">
      <FadeInOut>
        <ResponsiveRow
          breakpoint={breakpoints.ultra}
          style={{ marginBottom: "1.5rem" }}
        >
          <Column style={{ flex: 7 }}>
            <StakingOverview
              loading={!accountDelegationsIsDoneLoading}
              accountDelegations={accountDelegations}
            />
            <Spacer />
            <Row>
              <Delegate
                loading={!delegateIsDoneLoading}
                accountBalance={accountBalance}
                delegations={delegations}
                accountDelegations={accountDelegations}
              />
              <Spacer />
              <Rewards
                loading={!activeDelegationsIsDoneLoading}
                accountDelegations={accountDelegations}
                delegations={delegations}
              />
            </Row>
            <Spacer />
            <Row>
              <FluidRewards
                loading={!activeDelegationsIsDoneLoading}
                accountDelegations={accountDelegations?.data}
                delegations={delegations?.data}
              />
              {/*<Spacer />*/}
              {/*<LiquidStaking*/}
              {/*  loading={!activeDelegationsIsDoneLoading}*/}
              {/*  accountDelegations={accountDelegations}*/}
              {/*  delegations={delegations}*/}
              {/*/>*/}
            </Row>
          </Column>
          <Spacer />
          <Column style={{ flex: 5 }}>
            <ActiveDelegations
              loading={!activeDelegationsIsDoneLoading}
              accountDelegations={accountDelegations}
              delegations={delegations}
            />
            <Spacer />
            <WithdrawRequests
              loading={!activeDelegationsIsDoneLoading}
              accountDelegations={accountDelegations}
              delegations={delegations}
            />
          </Column>
        </ResponsiveRow>
      </FadeInOut>
    </ErrorBoundary>
  );
};

export default Staking;
