/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

exports.module = {
  getCustomFieldItemsOnBoard: async (Trello, boardId) => {
    return await Trello.makeRequest("get", `/1/boards/${boardId}/cards/?fields=name,url,idAttachmentCover&customFieldItems=true`);
  },
  getAttachment: async (Trello, cardId, attachmentId) => {
    return await Trello.makeRequest("get", `/1/cards/${cardId}/attachments/${attachmentId}`);
  },
};
