import type { NextApiRequest, NextApiResponse } from 'next'
import { NextApiResponseServerIO, TAllMessages, TMessage, TNextApi } from '../../types/types'
import { MongoClient, SortDirection } from 'mongodb';

const MyNextApi = async (
  req: NextApiRequest,
  res: NextApiResponseServerIO
) => {
  const posted = req.body as TNextApi;
  const cliant = new MongoClient(process.env.MONGODB_URI!);
  try {
    const db = (await cliant.connect()).db("shogi");
    const messages = db.collection<TMessage & { gameID: string }>("messages");

    switch (posted.command) {
      case "sendMessage": {
        const result = await messages.insertOne({ ...posted.message!, gameID: posted.gameID });
        if (!result.acknowledged) {
          res.status(200).json({ isMessageOK: false, error: "not acknowledged", result: result });
          break;
        }
        const checkResult = await messages.find({
          gameID: posted.gameID,
        }, {
          sort: { "_id": -1 },
          limit: 2,
        }).toArray();
        if (checkResult.length === 1) {
          res.status(200).json({ isMessageOK: true })
          break;
        }
        if (checkResult[1].messageID !== posted.message!.lastMessageID) {
          if (result.insertedId != undefined) {
            await messages.findOneAndDelete({
              _id: result.insertedId
            })
          }
          res.status(200).json({ isMessageOK: false, error: "checkResult[1].messageID !== posted.message.lastMessageID", result: result });
          break;
        }
        res.socket?.server?.io?.in(posted.gameID).except(posted.socketID).emit("message", posted.message);
        res.status(200).json({ isMessageOK: true });
        break;
      }
      case "requestAllMessages": {
        const result = await messages.find({
          gameID: posted.gameID
        }, {
          sort: { "_id": 1 },
          projection: { _id: false, gameID: false },
        }).toArray();
        res.status(200).json(result);
        break;
      }
    }
  } catch {
    res.status(500);
  } finally {
    res.end();
    await cliant.close();
  }
}

export default MyNextApi;