import { ObjectId } from "mongodb";

import DocCollection, { BaseDoc } from "../framework/doc";
import { NotAllowedError, NotFoundError } from "./errors";

export enum OpinionDegree {
  StronglyDisagree = "Strongly Disagree",
  Disagree = "Disagree",
  SlightlyDisagree = "Slightly Disagree",
  Neutral = "Neutral",
  SlightlyAgree = "Slightly Agree",
  Agree = "Agree",
  StronglyAgree = "Strongly Agree",
  Undecided = "Undecided",
}

export interface SideDoc extends BaseDoc {
  user: ObjectId;
  item: ObjectId;
  degree: OpinionDegree;
}

/**
 * concept: Sideing
 */
export default class SideingConcept {
  public readonly sides: DocCollection<SideDoc>;

  /**
   * Make an instance of Sideing.
   */
  constructor(collectionName: string) {
    this.sides = new DocCollection<SideDoc>(collectionName);
  }

  async create(user: ObjectId, item: ObjectId, degreeInput: string) {
    const degree = await this.assertDegree(degreeInput);
    await this.assertNewTopic(user, item);
    const _id = await this.sides.createOne({ user, item, degree });
    return { msg: "Side successfully created!", side: await this.sides.readOne({ _id }) };
  }

  async getSideByUserAndItem(user: ObjectId, item: ObjectId) {
    const side = await this.sides.readOne({ user, item });
    if (!side) {
      throw new NotFoundError(`Side for user ${user} and item ${item} not found!`);
    }
    return side;
  }

  async getSideByUser(user: ObjectId) {
    return await this.sides.readMany({ user });
  }

  async update(user: ObjectId, item: ObjectId, newside?: string) {
    if (newside) {
      await this.sides.partialUpdateOne({ user, item }, { degree: await this.assertDegree(newside) });

    }
    return { msg: "Response successfully updated!" };
  }

  async assertUserHasSide(user: ObjectId, item: ObjectId) {
    const side = await this.sides.readOne({ user, item });
    if (!side) {
      throw new NoSideFoundForUserError(user, item);
    }
  }

  private async assertDegree(degree: string){
    if (!Object.values(OpinionDegree).includes(degree as OpinionDegree)) {
      throw new NotFoundError(`Degree ${degree} is not a valid side!`);
    }
    return degree as OpinionDegree;
  }

  private async assertNewTopic(user: ObjectId, item: ObjectId) {
    const side = await this.sides.readOne({ user, item });
    if (side) {
      throw new UserAlreadyHasTopicSideError(user, item);
    }
  }
}

export class UserAlreadyHasTopicSideError extends NotAllowedError {
  constructor(
    public readonly author: ObjectId,
    public readonly _id: ObjectId,
  ) {
    super("{0} already has a side for {1}!", author, _id);
  }
}

export class NoSideFoundForUserError extends NotFoundError {
  constructor(
    public readonly author: ObjectId,
    public readonly _id: ObjectId,
  ) {
    super("{0} doesn't have a side for topic {1}!", author, _id);
  }
}
