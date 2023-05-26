import { Context, APIGatewayEvent, Handler } from "aws-lambda";
import { getExecutionContext } from "./executor";
import { ReceiveTransactionWebhookInput } from "../../../lib/core/models";

export const handler: Handler = async (
	_event: APIGatewayEvent,
	context: Context
): Promise<any> => {
	context.callbackWaitsForEmptyEventLoop = false;

	let executionError: Error | undefined;

	const body: ReceiveTransactionWebhookInput = JSON.parse(_event.body!);

	try {
		const executionContext = await getExecutionContext(body.sortCode);

		const result =
			await executionContext.receiveTransactionWebhookUseCase.execute(body);

		return {
			statusCode: 200,
			body: JSON.stringify(result),
		};
	} catch (err) {
		executionError = err as Error;
	}

	if (executionError) {
		// Re throw the error so AWS Lambda can retry the event
		throw executionError;
	}
};
