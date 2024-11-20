from jira import JIRA
from step_utility import StepUtility
import sys 

class JiraAuth:
    def __init__(self, environment: 'Environment'):
        self.environment = environment 
        self.auth_methods = {
            "basic_auth": self.basic_auth_func,
            "token_auth": self.token_auth_func,
            "oauth": self.oauth_func, 
            "jwt": self.jwt_auth_func       
        }

    def do_auth(self) -> JIRA:
        if self.environment.auth_method not in self.auth_methods:
            StepUtility.printFail("Exiting Step - Invalid AUTH method - Options: basic_auth/token_auth/oauth/jwt")
            sys.exit(1)

        res = self.auth_methods.get(self.environment.auth_method)()
        return JIRA(self.environment.jira_base_url, **res)

    def basic_auth_func(self) -> dict:
        if not self.environment.jira_username or not self.environment.jira_api_key:
            StepUtility.printFail("Exiting Step - basic auth needs username and API key")
            sys.exit(1)    
        return { 
            'basic_auth': (self.environment.jira_username, self.environment.jira_api_key) 
        }

    def token_auth_func(self) -> dict:
        if not self.environment.jira_pat_token:
            StepUtility.printFail("Exiting Step - token auth needs PAT token")
            sys.exit(1)
        return {
            'token_auth': self.environment.jira_pat_token
        }

    def oauth_func(self):
        StepUtility.printFail("Exiting Step - OAuth not implemented")
        sys.exit(1)

    def jwt_auth_func(self):
        StepUtility.printFail("Exiting Step - JWT Auth not implemented")
        sys.exit(1)





