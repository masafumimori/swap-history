import {Approval, Transaction} from "../types";
import { AcalaEvmEvent, AcalaEvmCall } from '@subql/acala-evm-processor';
import { BigNumber } from "ethers";

// Setup types from ABI
type TransferEventArgs = [string, string, BigNumber] & { from: string; to: string; value: BigNumber; };
type ApproveCallArgs = [string, BigNumber] & { _spender: string; _value: BigNumber; }

export async function handleAcalaEvmEvent(event: AcalaEvmEvent<TransferEventArgs>): Promise<void> {
    const transaction = new Transaction(event.transactionHash);

    transaction.value = event.args.value.toBigInt();
    transaction.from = event.args.from;
    transaction.to = event.args.to;
    transaction.contractAddress = event.address;

    await transaction.save();
}

export async function handleAcalaEvmCall(event: AcalaEvmCall<ApproveCallArgs>): Promise<void> {
    const approval = new Approval(event.hash);

    approval.owner = event.from;
    approval.value = event.args._value.toBigInt();
    approval.spender = event.args._spender;
    approval.contractAddress = event.to;

    await approval.save();
}
