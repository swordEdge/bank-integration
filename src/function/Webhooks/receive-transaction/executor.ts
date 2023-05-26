import { ReceiveTransactionWebhookUseCase } from "../../../lib/core/ports/webhooks/usecases";
import { WebhookManager } from "../../../lib/core/ports/webhooks/adapters";
import { ReceiveTransactionWebhookService } from "../../../lib/core/services/webhooks/ReceiveTransactionWebhookService";
import { Logger } from "../../../lib/core/ports/shared/adapters/Logger";
import { MockBankWebhookManager } from "../../../lib/infra/WebhookManager";
import { ECSWinstonLogger } from "../../../lib/infra/Logger";
import { BANK_SORT_CODE } from "../../../config";
import { checkEnv } from "../../../lib/utils/checkEnv";

checkEnv();

export type ExecutionContext = {
	receiveTransactionWebhookUseCase: ReceiveTransactionWebhookUseCase;
};

export async function getExecutionContext(
	sortCode: string
): Promise<ExecutionContext> {
	const logger: Logger = new ECSWinstonLogger({
		level: "debug",
	});

	let webhookManager: WebhookManager;
	switch (sortCode) {
		case BANK_SORT_CODE.MOCK_BANK:
			webhookManager = new MockBankWebhookManager();
			break;
		default:
			throw new Error("Unsupported Bank Sort Code");
	}

	const receiveTransactionWebhookUseCase = new ReceiveTransactionWebhookService(
		webhookManager,
		logger
	);

	return {
		receiveTransactionWebhookUseCase,
	};
}
