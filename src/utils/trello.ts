/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

export const getCustomFieldItemsOnBoard = async (Trello: any, boardId: string) => {
  return await Trello.makeRequest("get", `/1/boards/${boardId}/cards/?fields=name,url,idAttachmentCover&customFieldItems=true`);
};

export const getAttachment = async (Trello: any, cardId: string, attachmentId: string) => {
  return await Trello.makeRequest("get", `/1/cards/${cardId}/attachments/${attachmentId}`);
};
