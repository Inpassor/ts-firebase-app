import {
    ExpressRequest,
    ExpressResponse,
} from '../interfaces';
import {Model} from '../model';

const _models: { [key: string]: typeof Model } = {};

export const models = (options: { [key: string]: typeof Model }) => {
    return (request: ExpressRequest, response: ExpressResponse, next: () => void): void => {
        if (!Object.keys(_models).length && options && Object.keys(options).length) {
            for (const modelName in options) {
                _models[modelName] = options[modelName];
                _models[modelName].modelName = modelName;
                _models[modelName].request = request;
                _models[modelName].response = response;
                _models[modelName].firestore = request.firestore;
            }
        }
        request.models = _models;
        next();
    };
};
