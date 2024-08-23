import { ImCross } from "react-icons/im";
import LoginForm from "../../components/login-form/loginForm";
import ForgetPasswordForm from "../../components/forget-password-form/ForgetPasswordForm";
import ResetCodeForm from "../../components/forget-password-form/ResetCodeForm";
import CreateNewPassword from "../../components/forget-password-form/CreateNewPassword";
import CancelOrderModal from "../cancel-order-modal/CancelOrderModal";
import FeedbackForm from "../feedback-form/feedbackForm";
import RedeemOrderModal from "../redeem-order-modal/redeemOrderModal";
import CreateAccountForm from "../create-account-form/createAccountForm";
import VerifyAccountForm from "../verify-account-form/VerifyAccountForm";
import MultipleVenuesModal from "../multiple-venues-modal/MultipleVenuesModal";
import { allStrings } from "../../commons";
import "./style.scss";
import MultipleRewardsModal from "../../multiple-rewards-modal/MultipleRewardsModal";

function Modal({
  openModal,
  changeModalScreen,
  modalScreen,
  checkoutForm,
  rewardCouponVendors,
  contestLogin,
}) {
  const handleClick = (e) => {
    if (
      e.target.classList.contains("exit") ||
      (e.target.tagName === "path" &&
        e.target.parentElement.classList.contains("exit"))
    ) {
      openModal(false);
      changeModalScreen(allStrings.modalScreens.login);
    }
  };

  return (
    <div className="overlay exit" onClick={handleClick}>
      <div className="modal">
        <ImCross className="cross-icon exit" />
        {modalScreen === allStrings.modalScreens.login ? (
          <LoginForm
            openModal={openModal}
            changeModalScreen={changeModalScreen}
            checkoutForm={checkoutForm}
            contestLogin={contestLogin}
          />
        ) : modalScreen === allStrings.modalScreens.forgetPassword ? (
          <ForgetPasswordForm changeModalScreen={changeModalScreen} />
        ) : modalScreen === allStrings.modalScreens.resetCodeForm ? (
          <ResetCodeForm changeModalScreen={changeModalScreen}></ResetCodeForm>
        ) : modalScreen === allStrings.modalScreens.createPassword ? (
          <CreateNewPassword
            openModal={openModal}
            changeModalScreen={changeModalScreen}
          ></CreateNewPassword>
        ) : modalScreen === allStrings.modalScreens.feedbackForm ? (
          <FeedbackForm></FeedbackForm>
        ) : modalScreen === allStrings.modalScreens.redeemOrder ? (
          <RedeemOrderModal
            openModal={openModal}
            changeModalScreen={changeModalScreen}
          />
        ) : modalScreen === allStrings.modalScreens.createAccount ? (
          <CreateAccountForm
            openModal={openModal}
            changeModalScreen={changeModalScreen}
          />
        ) : modalScreen === allStrings.modalScreens.venues ? (
          <MultipleVenuesModal
            openModal={openModal}
            changeModalScreen={changeModalScreen}
          />
        ) : modalScreen === allStrings.modalScreens.rewards ? (
          <MultipleRewardsModal
            openModal={openModal}
            changeModalScreen={changeModalScreen}
            rewardCouponVendors={rewardCouponVendors}
          />
        ) : modalScreen === allStrings.modalScreens.verifyAccount ? (
          <VerifyAccountForm
            changeModalScreen={changeModalScreen}
            contestLogin={contestLogin}
            openModal={openModal}
          />
        ) : (
          <CancelOrderModal openModal={openModal} />
        )}
      </div>
    </div>
  );
}

export default Modal;
