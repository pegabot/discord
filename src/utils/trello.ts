/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

export const getCustomFieldItemsOnBoard = async (Trello: any, boardId: string) => {
  return await Trello.makeRequest("get", `/1/boards/${boardId}/cards/?fields=name,url,idAttachmentCover&customFieldItems=true`);
};

export const getAttachment = async (Trello: any, cardId: string, attachmentId: string) => {
  return await Trello.makeRequest("get", `/1/cards/${cardId}/attachments/${attachmentId}`);
};
