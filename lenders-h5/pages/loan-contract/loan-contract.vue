<template>
	<view class="loan-contract-main">
		<view class="serial-no">
			Serial No:
			<text class="m-l-10 text-decoration-underline">{{loanContract.SerialNo}}</text>
		</view>
		<view class="loan-contract-title">
			Loan Contract
		</view>
		<view class="borrowing-header-text">
			Party A（Lender）:
			<text class="m-l-10 text-decoration-underline">{{loanContract.NBFCCompany }}</text>
		</view>
		<view class="borrowing-header-text">
			Party B（Borrower）:
			<text class="m-l-10 text-decoration-underline">{{loanContract.UserName}}</text>
		</view>
		<view class="borrowing-header-text">
			ID Card No:
			<text class="m-l-10 text-decoration-underline">{{loanContract.AadhaarCardNo }}</text>
		</view>
		<view class="borrowing-header-text">
			Phone No:
			<text class="m-l-10 text-decoration-underline">{{loanContract.PhoneNo}}</text>
		</view>
		<view class="m-t-30">In view of:</view>
		<view>This contract has been entered into by consensus of all parties, and is hereby jointly abide by.</view>
		<view class="noun-title">
			Chapter I definition of nouns
		</view>
		<view class="">
			<text class="font-weight-bold">Article 1</text> In this contract, unless the context otherwise explains, the following terms have the following meanings:
		</view>
		<view class="m-t-10">
			(1) Lender：A Company incorporated under the Companies Act 2013.
		</view>
		<view class="m-t-10">
			(2) Borrower：A natural person, legal person or other organization, and voluntarily borrows money from Party A.
		</view>
		<view class="m-t-10">
			(3) Personal Information：Refers to the information that can be used to identify the user's identity, address and loan, including but not limited to Permanent Account Number (PAN) Card, Aadhaar card, Voter ID card, bank account, online account, location, electronic communication, etc. or such other documents which lender accepts. 
		</view>
		<view class="m-t-10">
			(4) Agreement Effective Date：Point out the time when the lender and borrower officially executes this Agreement. 
		</view>
		<view class="noun-title">Chapter 2 Loan Information and Interest Calculation</view>
		<view class="">
			<text class="font-weight-bold">Article 2</text> Loan Information
		</view>
		<view class="">
			<text class="font-weight-bold">Article 3</text> Repayment Method：
		</view>
		<view class="table-loan">
			<view class="row">
				<view class="col-auto">
					Loan Principal
				</view>
				<view class="col">
					Rs. {{loanContract.LoanPrincipal}}
				</view>
			</view>
			<view class="row">
				<view class="col-auto">
					Loan Term
				</view>
				<view class="col">
					<text class="text-decoration-underline">{{loanContract.LoanTerm }}</text> day, Calculated from the date of actual loan by The Lender
				</view>
			</view>
			<view class="row">
				<view class="col-auto">
					Service Fee
				</view>
				<view class="col">
					Rs. <text class="text-decoration-underline">{{loanContract.ServiceFee }}</text>，Service fee includes but is not limited to: Loan analysis, evaluation, post loan management, loan service fee, etc. The service fee shall be borne by the borrower. The lender will deduct the service fee from the amount to be lent.
				</view>
			</view>
			<view class="row">
				<view class="col-auto">
					Approval Fee (Processing Fees)
				</view>
				<view class="col">
					{{loanContract.ApprovalFee }}
				</view>
			</view>
			<view class="row">
				<view class="col-auto">
					Date of Disbursal
				</view>
				<view class="col">
					{{loanContract.DateofDisbursal }}
				</view>
			</view>
			<view class="row">
				<view class="col-auto">
					Due date for scheduled repayment
				</view>
				<view class="col">
					{{loanContract.RepaymentDate}}
				</view>
			</view>
			<view class="row">
				<view class="col-auto">
					Total repayment due (Principal + Interest + Fee+ charges, if any)
				</view>
				<view class="col">
					{{loanContract.TotalRepaymentDue}}
				</view>
			</view>
			<view class="row">
				<view class="col-auto">
					Date of loan contract Execution
				</view>
				<view class="col">
					{{loanContract.LoanDate }}
				</view>
			</view>
		</view>
		<view class="m-t-10">The borrower repays full amount outstanding including interest, principal or any other charges/fees as payable at the end of the loan term.</view>
		<view class="noun-title">Chapter 3 Transfer and Return of Loan</view>
		<view class="">
			<text class="font-weight-bold">Article 4</text> Interest Starting Date
		</view>
		<view class="">
			The Borrower shall pay the Interest Rate as mentioned in this agreement. The loan funds of Party A shall be transferred to the collection account of Party B, and the date of successful transfer shall be the interest calculation date, which shall be subject to the successful time of bank transfer. The Borrower understand that Interest Rate may change from time to time as per RBI guidelines and the same shall be effective prospectively only.
		</view>
		<view class="">
			<text class="font-weight-bold">Article 5</text> Repayment
		</view>
		<view class="">
			Party B shall repay on the repayment date agreed in this contract. Since Party A receives all the repayment, the loan relationship between Party A and Party B is terminated, and the time when the payment reaches Party A's account may be affected by bank clearing and other factors.
		</view>
		<view class="">
			<text class="font-weight-bold">Article 6</text> Reimbursement Order
		</view>
		<view>The order of repayment: Party B shall repay all the repayable amount in a lump sum on schedule. If Party B is unable to repay the amount in a lump sum due to Party B's reasons, it may apply to Party A for partial repayment in advance, and the order of repayment is the overdue penalty interest, service fee , interest and principal that shall be paid.</view>
		<view class="">
			<text class="font-weight-bold">Article 7</text> Early Repayment
		</view>
		<view>
			The loan under the loan contract can be repaid in advance.
			For the loan items that can be repaid in advance, Party B can repay the principal and interest of the loan in advance on any working day during the normal loan period. In case of prepayment, Party B shall pay off the loan principal and prepayment interest in a lump sum. Prepayment charges interest according to normal repayment，without interest relief. 
		</view>
		<view class="noun-title">Chapter 4 Party A Right and Obligation</view>
		<view class="">
			<text class="font-weight-bold">Article 8</text>If Party B violates any term of this agreement, Party A shall have the right to terminate this Agreement and to claim rights from Party B in accordance with this agreement.
		</view>
		<view class="">
			<text class="font-weight-bold">Article 9</text> Party A is a person governed by the laws of the Republic of India, with full capacity for civil rights, and independently exercises and assumes rights and obligations in accordance with the terms of this agreement.
		</view>
		<view class="">
			<text class="font-weight-bold">Article 10</text> Party A guarantees that the source of the loan provided is legal.
		</view>
		<view class="">
			<text class="font-weight-bold">Article 11</text> If the contact information and other information provided by Party A are changed, Party B shall be notified in time.
		</view>
		<view class="noun-title">Chapter 5 Party B Right and Obligation</view>
		<view class="">
			<text class="font-weight-bold">Article 12</text> When the repayment is due, Party B needs to make a one-time payment and repay the loan money and the loan interest including all other outstanding charges as may be payable to the account designated by Party A.
		</view>
		<view class="">
			<text class="font-weight-bold">Article 13</text> Party B is a person governed by the laws of the Republic of India  has full capacity for civil rights, and independently exercises and represents, warrants and acknowledges
			<view>
				(a) it is a citizen and a person resident in India
			</view>
			<view>
				(b) all information furnished in respect of the Facility are correct and the Borrower is a major, of sound mind and competent to contract
			</view>
			<view class="">
				(c) that the Borrower has the authority to enter into and perform its obligations under this agreement
			</view>
			<view class="">
				(d) to furnish all information of its finances and business as is required by the Lender
			</view>
			<view class="">
				(e) it is not a party to any litigation and to the best of its knowledge, no act(s) or omission(s) has been committed that may give rise to any litigation
			</view>
			<view>
				(f) that all repayments shall be in compliance of all applicable laws
			</view>
			<view class="">
				(g) shall utilize the Loan for the purpose mentioned herein.
			</view>
		</view>
		<view class="">
			<text class="font-weight-bold">Article 14</text>  The personal information Party B promises to provide (including but not limited to ID card number, address, contact information and emergency contact person, etc.) is true, valid, effective and complete, and does not conceal any matters that affect or may affect its credit, and does not have any matters that affect or may affect Party A's willingness to lend funds.
		</view>
		<view class="">
			<text class="font-weight-bold">Article 15</text> Party B shall truthfully provide personal information to  Party A, and authorize Party A or a third party designated by Party A to inspect such personal information, and manage and use such personal information for the purpose of this agreement. Party B shall bear all consequences and legal liabilities when the personal information provided is deemed as false.
Over and above the aforementioned points, upon delay by the Borrower to pay outstanding amount on or before the Due Date, or breach of any representation or warranty, the Lender shall be entitled to , a) declare all sums outstanding under the Loan and other applicable charges to become immediately due and payable; (b) report the Borrower as a defaulter to Reserve Bank of India and other credit bureau agencies; (c) invoke Repayment Instruments or similar forms obtained from the Borrower, and/ or (d) exercise any other rights or remedy permitted by applicable law.
		</view>
		<view class="">
			<text class="font-weight-bold">Article 16</text> Party B undertakes and guarantees not to use the loan to engage in activities prohibited by laws, regulations or policies of the Republic of India.
		</view>
		<view class="">
			<text class="font-weight-bold">Article 17</text> Party B irrevocably authorizes Party A to deduct service fee from the loan.
		</view>
		<view class="">
			<text class="font-weight-bold">Article 18</text> Party B shall keep a good credit investigation record and credit, and perform the repayment obligation on time in accordance with the agreement.
		</view>
		<view class="">
			<text class="font-weight-bold">Article 19</text> Party B guarantees to return the full amount of the loan to the account designated by Party A on the final repayment date.
		</view>
		<view class="">
			<text class="font-weight-bold">Article 20</text> During the validity period of this agreement, if Party B needs to borrow money from or provide guarantee for a third party outside the agreement, it shall notify Party A in writing seven days in advance. 
		</view>
		<view class="">
			<text class="font-weight-bold">Article 21</text> Party B agree and confirm that if Party B fails to pay the loan interest or loan funds or fulfill the obligations in this agreement , Party A has the right to the third party through including but not limited to Internet media, printing media, television, credit system to disclose the borrower's photo, name, contact information, ID card number, overdue repayment and other information. The Lender shall be entitled to appoint and outsource its activities under this agreement to one or more service providers for the purpose of collecting KYC information, Loan related documents, collection, service etc. The Borrower understands and agrees that the services of such agents are essential for purpose of and effective enjoyment of the Loan.
		</view>
		<view class="noun-title">Chapter 6 Liability for breach of contract</view>
		<view class="">
			<text class="font-weight-bold">Article 22</text> Overdue Interest/ Late Payment. Failure to repay the Loan outstanding on the Due Date shall be treated as an event of default and the Lender shall be entitled to charge Late Payment Fee and Overdue Interest on the Loan at the rate mentioned in the Agreement. The Interest Rate, Overdue Interest and shall be calculated on 365/366 days based on the actual days elapsed.
			If Party B's repayment under this contract is overdue, Party B shall pay penalty interest from the overdue date until the repayment.
			The penalty interest is calculated as follows:
			Total Penalty Interest = Overdue Principal Interest*Penalty Interest Rate*Overdue Days
			(Different overdue days correspond to different penalty interest rates.)
			The Borrower shall indemnify the Lender, its directors, employees and agents against all costs, losses, and/ or damages due to any act or default on the part of the Borrower(s) in respect of the Loan and/or for the recovery of the outstanding dues on account of failure of the Borrower(s) of any of the terms and conditions herein and/or for any action undertaken by the Lender in good faith based on representations of the Borrower.
		</view>
		<view class="">
			<text class="font-weight-bold">Article 23</text> If the source of loan provided by the lender is illegal ,the lender shall be deemed to have breached the contract.
		</view>
		<view class="noun-title">Chapter 7 Rescission of a contract</view>
		<view class="">
			<text class="font-weight-bold">Article 24</text> In case of any of the following situations, Party A may terminate this agreement at any time:
			<view>(1) Party B fails to perform the repayment obligations as agreed in this agreement.</view>
			<view>(2) Party B takes the initiative to evade, refuse to communicate, refuse to admit the fact of arrears and other malicious acts after the due date of repayment.</view>
			<view>(3) During the term of the agreement and before the due date of payment, Party B is deemed unable to repay the loan according to the reasonable evaluation of Party A.</view>
			<view>(4) Party B fails to notify the Party A in time within three days after providing false information, concealing important facts, or changing the ID number, address, contact information, etc.</view>
			<view>(5) Party B borrows money from or provides guarantee for a third party other than this agreement, but fails to inform Party A in writing within seven days.</view>
			<view>(6) Any property of the borrower is seized, confiscated, expropriated, sealed up, frozen and other adverse events that may affect the ability to travel, and the lender are not informed in writing or effective remedial measures are not provided in time.</view>
		</view>
		<view>
			<text class="font-weight-bold">Article 25</text> All parties under the contract confirm that the signing, entry into force and performance of this Agreement shall not violate the effective laws of the Republic of India. If any one or more clauses in this agreement violate applicable laws and regulations, such clause shall be deemed invalid, but such invalid clause shall not affect the validity of other clauses in this agreement.
		</view>
		<view>
			<text class="font-weight-bold">Article 26</text> At the end of the term, if the principal, interest, penalty interest and all others payable of the loan outstanding under this contract and its annexes are not paid off, the relevant provisions of this contract shall continue to apply.
		</view>
		<view class="noun-title">Chapter 8 Dispute resolution</view>
		<view>
			<text class="font-weight-bold">Article 27</text> The signing, performance, dissolution and interpretation of this Agreement shall be governed by the effective laws of the Republic of India.
		</view>
		<view>
			<text class="font-weight-bold">Article 28</text> Party A, Party B shall perform this agreement in good faith on the principle of honesty and trustworthiness. In case of any dispute, it shall be settled through negotiation. 
In the unlikely event of any dispute or difference arising between the parties hereto as to the rights and obligations under this Agreement or as to any claim, monetary or otherwise of one party against the other or as to the interpretation and effect of any terms and conditions of this Agreement such dispute or difference shall be referred to the Authorised Signatories of both the Parties at first level. In the event such dispute or claim cannot be settled by the parties within ninety (90) days after written notification by one party of the existence of such dispute or claim, then such dispute shall be referred to Arbitration of a common Arbitrator if agreed upon, otherwise to two or more Arbitrators, one to be appointed by each of the parties to this Agreement and such Arbitrator shall be governed by the provisions of Arbitration and Conciliation Act, 1996 as at present in force and as may be amended from time to time. The venue for such Arbitration shall be in India at New Delhi. The language to be used in the arbitral proceedings shall be English. The award rendered by the arbitrators shall be final and binding upon both Parties and may be executed through any court of competent jurisdiction forthwith. Each Party shall bear its own expenses and attorneys’ fees in connection with the arbitration.
If the negotiation fails, the dispute shall be settled by legal means of the court of New Delhi.
		</view>
		<view>
			<text class="font-weight-bold">Article 29</text> During the litigation, each party shall perform its rights and obligations in accordance with this agreement, and each party shall not refuse to perform its obligations under this Agreement on the grounds of dispute settlement.
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				loanContract: {}, // 借款协议对象
				userPhone: ''
			};
		},
		onLoad(options) {
			uni.setNavigationBarTitle({
				title: 'Loan Contract'
			})
			console.log(options);
			this.userPhone = options.phone;
			this.initLoanContractInfo();
		},
		methods: {
			initLoanContractInfo() {
				if (!this.userPhone) {
					return false;
				}
				this.sessionService.fetchLoanContractInfo({Mobile: this.userPhone}).then(res => {
					console.log(res);
					this.loanContract = res;
				});
			}
		}
	}
</script>

<style lang="scss">
	page {
		max-width: 100%;
		overflow: hidden;
		padding: 20rpx 20rpx 100rpx;
		.loan-contract-main {
			.serial-no, {
				text-align: right;
				padding-right: 20rpx;
			}
			.borrowing-header-text {
				margin-top: 10rpx;
			}
			.loan-contract-title {
				text-align: center;
				font-size: 50rpx;
				font-weight: bold;
				margin-top: 20rpx;
			}
			.noun-title {
				text-align: center;
				font-size: 32rpx;
				font-weight: bold;
				margin-top: 30rpx;
				margin-bottom: 10rpx;
			}
			.table-loan {
				margin-top: 10rpx;
				> view.row {
					border: 2rpx solid #000;
					border-bottom: none;
					align-items: center;
					&:last-child {
						border-bottom: 2rpx solid #000;
					}
					> view.col-auto {
						border-right: 2rpx solid #000;
						padding: 10rpx;
						width: 220rpx;
						// height: 100%;
					}
					> view.col {
						padding: 10rpx;
						border-left: 2rpx solid #000;
						margin-left: -2rpx;
					}
				}
			}
		}
	}
</style>
