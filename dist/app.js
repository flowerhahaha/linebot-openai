"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
if (process.env.NODE_ENV !== 'production') {
    dotenv_1.default.config();
}
const express_1 = __importDefault(require("express"));
const line_middleware_1 = require("./line-middleware");
const line_event_handler_1 = require("./line-event-handler");
require('./config/mongoose');
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Router for receive and reply message 
app.post('/webhook', line_middleware_1.lineMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Handles each incoming event and waits for all events to be processed
        const result = yield Promise.all(req.body.events.map(line_event_handler_1.handleEvent));
        res.json(result);
    }
    catch (err) {
        console.error(err);
        res.status(500);
    }
}));
app.listen(PORT, () => {
    console.log(`App is running on http://localhost:${PORT}`);
});
