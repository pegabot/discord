/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

exports.module = {
  getCustomFieldItemsOnBoard: async (Trello, boardId) => {
    return await Trello.makeRequest("get", `/1/boards/${boardId}/cards/?fields=name,url&customFieldItems=true`);
  },
};
