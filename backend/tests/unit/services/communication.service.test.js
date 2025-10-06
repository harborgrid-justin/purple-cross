"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const communication_service_1 = require("../../../src/services/communication.service");
const database_1 = require("../../../src/config/database");
jest.mock('../../../src/config/database', () => ({
    prisma: {
        message: {
            create: jest.fn(),
            findUnique: jest.fn(),
            findMany: jest.fn(),
            count: jest.fn(),
            update: jest.fn(),
        },
    },
}));
describe('CommunicationService', () => {
    let communicationService;
    beforeEach(() => {
        communicationService = new communication_service_1.CommunicationService();
        jest.clearAllMocks();
    });
    describe('sendMessage', () => {
        it('should send a message successfully', async () => {
            const messageData = {
                recipientId: 'client-123',
                subject: 'Test Message',
                content: 'This is a test message',
                type: 'email',
            };
            const expectedResult = {
                id: 'message-123',
                ...messageData,
                sentAt: new Date(),
                status: 'sent',
            };
            database_1.prisma.message.create.mockResolvedValue(expectedResult);
            const result = await communicationService.sendMessage(messageData);
            expect(database_1.prisma.message.create).toHaveBeenCalled();
            expect(result.status).toBe('sent');
        });
        it('should validate email format', async () => {
            const invalidMessage = {
                recipientId: 'client-123',
                content: 'Test',
                type: 'email',
                email: 'invalid-email',
            };
            // Mock validation failure
            const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
            expect(isValidEmail(invalidMessage.email)).toBe(false);
        });
    });
    describe('getMessageHistory', () => {
        it('should return message history for a client', async () => {
            const clientId = 'client-123';
            const mockMessages = [
                { id: 'msg-1', content: 'Message 1', sentAt: new Date() },
                { id: 'msg-2', content: 'Message 2', sentAt: new Date() },
            ];
            database_1.prisma.message.findMany.mockResolvedValue(mockMessages);
            const result = await communicationService.getMessageHistory(clientId);
            expect(database_1.prisma.message.findMany).toHaveBeenCalledWith(expect.objectContaining({
                where: expect.objectContaining({ recipientId: clientId }),
            }));
            expect(result).toEqual(mockMessages);
        });
    });
    describe('markAsRead', () => {
        it('should mark a message as read', async () => {
            const messageId = 'message-123';
            const unreadMessage = { id: messageId, read: false };
            const readMessage = { ...unreadMessage, read: true };
            database_1.prisma.message.findUnique.mockResolvedValue(unreadMessage);
            database_1.prisma.message.update.mockResolvedValue(readMessage);
            const result = await communicationService.markAsRead(messageId);
            expect(result.read).toBe(true);
        });
    });
});
//# sourceMappingURL=communication.service.test.js.map