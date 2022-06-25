const graphql = require("graphql");
var _ = require("loadsh");
const User = require("../model/user");
const Hobby = require("../model/hobby");
const Post = require("../model/post");

//dummy data
// var usersData = [
//   { id: "1", name: "wel", age: 37, profession: "Programmer" },
//   { id: "2", name: "skl", age: 23, profession: "Baker" },
//   { id: "3", name: "ram", age: 45, profession: "Mechanic" },
//   { id: "4", name: "rose", age: 73, profession: "Painter" },
//   { id: "5", name: "rishi", age: 21, profession: "Painter" },
//   { id: "6", name: "lkrishi", age: 17, profession: "Teacher" },
// ];

// var hobbieData = [
//   {
//     id: "56",
//     title: "Programmer",
//     description: "using computer....",
//     userId: "1",
//   },
//   {
//     id: "21",
//     title: "Rowing",
//     description: "Sweat and fell better",
//     userId: "1",
//   },
//   {
//     id: "13",
//     title: "Swimgin",
//     description: "Get in the water and learn to become the water",
//   },
// ];

// var postsData = [
//   { id: "16", comment: "build good", userId: "1" },
//   { id: "163", comment: "iyooo let me check it", userId: "1" },
//   { id: "11", comment: "bad felling", userId: "3" },
// ];

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
} = graphql;

//create types
const UserType = new GraphQLObjectType({
  name: "User",
  description: "Documentation for user...",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    profession: { type: GraphQLID },
    posts: {
      type: new GraphQLList(PostType),

      resolve(parent, args) {
        return Post.find({ userId: parent.id });
        // return _.filter(postsData, { userId: parent.id });
      },
    },

    hobbies: {
      type: new GraphQLList(HobbyType),
      resolve(parent, args) {
        return Hobby.find({ userId: parent.id });
        // return _.filter(hobbieData, { userId: parent.id });
      },
    },
  }),
});

const HobbyType = new GraphQLObjectType({
  name: "Hobby",
  description: "Hobby description",
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    user: {
      type: UserType,
      resolve(parent, args) {
        return _.find(usersData, { id: parent.userId });
      },
    },
  }),
});

//Post type
const PostType = new GraphQLObjectType({
  name: "Post",
  description: "Post Description",
  fields: () => ({
    id: { type: GraphQLID },
    comment: { type: GraphQLString },
    user: {
      type: UserType,
      resolve(parent, args) {
        return _.find(usersData, { id: parent.userId });
      },
    },
  }),
});

// root Query
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  description: "description",
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLString } },

      resolve(parent, args) {
        return User.findById(args.id);
      },
    },

    users: {
      type: new GraphQLList(UserType),
      resolve(parent, args) {
        return usersData;
      },
    },

    hobby: {
      type: HobbyType,
      args: { id: { type: GraphQLID } },

      resolve(parent, args) {
        return _.find(hobbieData, { id: args.id });
      },
    },
    hobbies: {
      type: new GraphQLList(HobbyType),
      resolve(parent, args) {
        return hobbieData;
      },
    },
    post: {
      type: PostType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Post.find({ userId: parent.id });
      },
    },

    posts: {
      type: new GraphQLList(PostType),
      resolve(parent, args) {
        return Post.find({});
        // return postsData;
      },
    },
  },
});

// mutation
const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    createUser: {
      type: UserType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
        profession: { type: GraphQLString },
      },
      resolve(parent, args) {
        let user = User({
          name: args.name,
          age: args.age,
          profession: args.profession,
        });

        return user.save();
      },
    },
    //update user
    updateUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
        profession: { type: GraphQLString },
      },
      resolve(parent, args) {
        return (updateUser = User.findByIdAndUpdate(
          args.id,
          {
            $set: {
              name: args.name,
              age: args.age,
              profession: args.profession,
            },
          },
          { new: true }
        ));
      },
    },

    //Remove user

    removeUser: {
      type: UserType,
      args: {
        id: { type: GraphQLString },
      },
      resolve(parent, args) {
        let romveUser = User.findByIdAndRemove(args.id).exec();
        if (!romveUser) {
          throw new "Error"();
        }
        return romveUser;
      },
    },
    // create post
    CreatePost: {
      type: PostType,
      args: {
        comment: { type: GraphQLString },
        userId: { type: GraphQLID },
      },
      resolve(parent, args) {
        let post = Post({
          comment: args.comment,
          userId: args.userId,
        });
        return post.save();
      },
    },
    //update post
    UpdatePost: {
      type: PostType,
      args: {
        id: { type: GraphQLString },
        comment: { type: GraphQLString },
      },
      resolve(parent, args) {
        return (updatePost = Post.findByIdAndUpdate(
          args.id,
          {
            $set: {
              comment: args.comment,
            },
          },
          { new: true }
        ));
      },
    },

    //remove post
    removePost: {
      type: PostType,
      args: {
        id: { type: GraphQLString },
      },
      resolve(parent, args) {
        let romvePost = Post.findByIdAndRemove(args.id).exec();
        if (!romvePost) {
          throw new "Error"();
        }
        return romvePost;
      },
    },
    // create hobby
    CreateHobby: {
      type: HobbyType,
      args: {
        //id: { type: GraphQLID },
        title: { type: GraphQLString },
        description: { type: GraphQLString },
        userId: { type: GraphQLID },
      },
      resolve(parent, args) {
        let hobby = Hobby({
          title: args.title,
          description: args.description,
          userId: args.userId,
        });
        return hobby.save();
      },
    },
    //update Hobbies
    UpdateHobby: {
      type: HobbyType,
      args: {
        id: { type: GraphQLString },
        title: { type: GraphQLString },
        description: { type: GraphQLString },
      },
      resolve(parent, args) {
        return (updateHobby = Hobby.findByIdAndUpdate(
          args.id,
          {
            $set: {
              title: args.title,
              description: args.description,
            },
          },
          { new: true }
        ));
      },
    },

    removeHobby: {
      type: HobbyType,
      args: {
        id: { type: GraphQLString },
      },
      resolve(parent, args) {
        let romveHobby = Hobby.findByIdAndRemove(args.id).exec();
        if (!romveHobby) {
          throw new "Error"();
        }
        return romveHobby;
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
