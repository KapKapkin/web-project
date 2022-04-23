from flask_restful import Resource, abort
from flask import Response
from data.token import token_required
import json

from api.parser import userparser
from data import db_session
from data.users import Users


def abort_if_users_not_found(users_id):
    session = db_session.create_session()
    users = session.query(Users).get(users_id)
    if not users:
        abort(404, message=f"Users {users_id} not found")

class UsersListResource(Resource):
    @token_required
    def get(user):
        args = userparser.parse_args()
        print(args)
        users_id = args['user_id']
        session = db_session.create_session()
        users = session.query(Users).get(users_id)
        return Response(response=json.dumps({'users': users.to_dict(
           only=('id', 'name', 'surname', 'email', 'age', 'tags')
        ), 'user_id':user.id}), status=200)
    
    @token_required
    def post(user):
        args = userparser.parse_args()
        session = db_session.create_session()
        users = Users(
            name=args['name'],
            surname=args['surname'],
            email=args['email'],
            age=args['age'],
            tags=args['tags'],
        )
        users.set_password(args['password'])
        session.add(users)
        session.commit()
        return Response(response=json.dumps({'succes': 'OK'}), status=200)

    @token_required
    def delete(user):
        print(user.id)
        abort_if_users_not_found(user.id)
        session = db_session.create_session()
        users = session.query(Users).get(user.id)
        session.delete(users)
        session.commit()
        return Response(response=json.dumps({'succes': 'OK'}), status=200)