import json
import sys
import os
import ast
import re
import requests

from jira import JIRA
from step_utility import StepUtility
from requests.auth import HTTPBasicAuth
from jira_auth import JiraAuth

class Environment:
    def __init__(self, jira_base_url, auth_method, jira_username, jira_api_key, jira_pat_token, action,
        issue, issue_project, issue_summary, issue_description, issue_type, issue_components, issue_customfields,
        existing_comment_id, comment_body, status, jql_query, jql_query_max_results,
        verbose):
        self.jira_base_url = jira_base_url
        self.auth_method = auth_method
        self.jira_username = jira_username
        self.jira_api_key = jira_api_key
        self.jira_pat_token = jira_pat_token
        self.action = action
        self.issue = issue
        self.issue_project = issue_project
        self.issue_summary = issue_summary
        self.issue_description = issue_description
        self.issue_type = issue_type
        self.issue_components = issue_components
        self.issue_customfields = issue_customfields
        self.existing_comment_id = existing_comment_id
        self.comment_body = comment_body
        self.status = status
        self.jql_query = jql_query
        self.jql_query_max_results = jql_query_max_results
        self.verbose = verbose


def main():
    current_environment = environment_setup()
    authenticated_jira = authentication(current_environment)
    step_action(current_environment.action, authenticated_jira, current_environment)


def environment_setup():
    # Grab all of the environment variables
    env = os.environ
    jira_base_url = StepUtility.getEnvironmentVariable('JIRA_BASE_URL', env)
    jira_auth_method = StepUtility.getEnvironmentVariable('JIRA_AUTH_METHOD', env)
    jira_username = StepUtility.getEnvironmentVariable('JIRA_USERNAME', env)
    jira_api_key = StepUtility.getEnvironmentVariable('JIRA_API_KEY', env)
    jira_pat_token = StepUtility.getEnvironmentVariable('JIRA_PAT_TOKEN', env)
    action = StepUtility.getEnvironmentVariable('ACTION', env)

    # Logic here to use the regex to grab the jira issue key and assign it to issue
    jira_issue_source_field = StepUtility.getEnvironmentVariable('JIRA_ISSUE_SOURCE_FIELD', env)
    jira_issue_source_field_regex = StepUtility.getEnvironmentVariable('JIRA_ISSUE_SOURCE_FIELD_REGEX', env)
    ## TODO - Brandon - need to do regex work here
    issue = jira_issue_source_field

    # Issue fields below
    # Retrieve the project environment variable and add the project to a dict representation
    issue_project_env = StepUtility.getEnvironmentVariable('ISSUE_PROJECT', env)
    issue_project = None
    if issue_project_env:
        issue_project = "{'key': '" + issue_project_env + "'}"

    issue_summary = StepUtility.getEnvironmentVariable('ISSUE_SUMMARY', env)
    issue_description = StepUtility.getEnvironmentVariable('ISSUE_DESCRIPTION', env)

    # Retrieve the type environment variable and add the type to a dict representation
    issue_type_env = StepUtility.getEnvironmentVariable('ISSUE_TYPE', env)
    issue_type = None
    if issue_type_env:
        issue_type = "{'name': '" + issue_type_env + "'}"

    # Retrieve the components, split the list, and create an array of dicts with each component
    issue_components_env = StepUtility.getEnvironmentVariable('ISSUE_COMPONENTS', env)
    issue_components = None
    if issue_components_env:
        issue_components = []
        split_components = issue_components_env.split(",")
        for component in split_components:
            component_string = "{'name': '" + component + "'}"
            issue_components.append(ast.literal_eval(component_string))

    # Retrieve customfields
    issue_customfields = StepUtility.getEnvironmentVariable('ISSUE_CUSTOMFIELDS', env)

    # Retrieve the comment information
    existing_comment_id = StepUtility.getEnvironmentVariable('JIRA_COMMENT_ID', env)
    comment_body = StepUtility.getEnvironmentVariable('COMMENT_BODY', env)

    # Desired Jira status information
    status = StepUtility.getEnvironmentVariable('DESIRED_ISSUE_STATUS', env)
    jql_query = StepUtility.getEnvironmentVariable('JQL_QUERY', env)
    jql_query_max_results = 50
    jql_query_max_results_env = StepUtility.getEnvironmentVariable('JQL_QUERY_MAX_RESULTS', env)
    if jql_query_max_results_env:
        jql_query_max_results = jql_query_max_results_env

    verbose = StepUtility.getEnvironmentVariable('VERBOSE', env)

    current_environment = Environment(
        jira_base_url,
        jira_auth_method,
        jira_username,
        jira_api_key,
        jira_pat_token,
        action,
        issue,
        issue_project,
        issue_summary,
        issue_description,
        issue_type,
        issue_components,
        issue_customfields,
        existing_comment_id,
        comment_body,
        status,
        jql_query,
        jql_query_max_results,
        verbose)
    return current_environment

def authentication(current_environment) -> JIRA:
    auth = JiraAuth(current_environment)
    return auth.do_auth()



def step_action(action, authenticated_jira, current_environment):
    print("Step Action: " + action)
    actions = {
        'issue_create': create_issue,
        'issue_update': update_issue,
        'issue_transition': transition_issue,
        'issue_transition_and_update': transition_issue,
        'comment_create': create_comment,
        'comment_update': update_comment,
        'verify_status': verify_issue_status,
        'update_all_from_jql_query': update_multiple_issues,
    }
    action_func = actions.get(action, action_required)
    if action_func:
        action_func(authenticated_jira, current_environment)
    else:
        StepUtility.printFail("Exiting Step - invalid ACTION environment variable")
        sys.exit(1)


def create_comment(jira, current_environment):
    print("\nCreate comment")
    try:
        comment_id = jira.add_comment(current_environment.issue, current_environment.comment_body)
        print("Comment id: " + str(comment_id))
        StepUtility.export_variable("JIRA_COMMENT_ID", comment_id)
    except Exception as exc:
        StepUtility.printCleanException(exc)
        StepUtility.printFail("Exiting Step - Failed to insert a comment")
        sys.exit(1)


def update_comment(jira, current_environment):
    print("\nUpdate comment")
    try:
        comment = jira.comment(current_environment.issue, current_environment.existing_comment_id)
        comment.update(body = current_environment.comment_body)
    except Exception as exc:
        StepUtility.printCleanException(exc)
        StepUtility.printFail("Exiting Step - Failed to update comment")
        sys.exit(1)


def create_issue(jira, current_environment):
    print("\nCreate issue")

    new_issue_dict = {}
    new_issue_dict.update(project = ast.literal_eval(current_environment.issue_project))
    new_issue_dict.update(summary = current_environment.issue_summary)
    new_issue_dict.update(description = current_environment.issue_description)
    new_issue_dict.update(issuetype = ast.literal_eval(current_environment.issue_type))
    if (current_environment.issue_components):
        new_issue_dict.update(components = current_environment.issue_components)

    # print(current_environment.issue_customfields)
    # sys.exit(1)

    if current_environment.issue_customfields:

        url = '{}/rest/api/3/field'.format(current_environment.jira_base_url)

        response = requests.request('GET', url, auth=HTTPBasicAuth(current_environment.jira_username, current_environment.jira_api_key))

        data = response.json()

        customfields = current_environment.issue_customfields.lstrip('[').rstrip(']')

        kv_pairs = re.findall(r'(\w+.*?)\s*=\s*(.*?)(?=(?:\s[^\s=]+|$))', customfields)

        for k, v in kv_pairs:

            if 'customfield' not in k:
                for item in data:
                    if k in item['name']:
                        customfield_id = item['id']
                new_issue_dict[customfield_id] = v
            else:
                new_issue_dict[k] = v

    try:
        created_issue = jira.create_issue(new_issue_dict)
        print("Jira issue " + str(created_issue) + " created")
        StepUtility.export_variable("JIRA_ISSUE_SOURCE_FIELD", created_issue)
        StepUtility.export_variable("JIRA_ISSUE_URL", str(current_environment.jira_base_url) + "/browse/" + str(created_issue))
    except Exception as exc:
        StepUtility.printCleanException(exc)
        StepUtility.printFail("Exiting Step - Failed to create issue")
        sys.exit(1)


def transition_issue(jira, current_environment):
    print("\nTransition issue status")
    issue = retrieve_jira_issue(jira, current_environment.issue)
    print("Current issue status: " + str(issue.fields.status))
    print("Desired issue status: " + current_environment.status)

    if str(issue.fields.status) == current_environment.status:
        print("Skipping transition as desired state is already met")
    else:
        # Verbose: Print the list of viable transitions before the transition takes place
        if current_environment.verbose == "true":
            transition_list = jira.transitions(current_environment.issue)
            print("Viable transition statuses before:")
            for transition in transition_list:
                print("\t" + transition['id'], transition['name'])
            print()

        transition_id = jira.find_transitionid_by_name(current_environment.issue, current_environment.status)
        if transition_id:
            try:
                jira.transition_issue(issue, transition_id)
            except Exception as exc:
                StepUtility.printCleanException(exc)
                StepUtility.printFail("Exiting Step - Failed to transition issue")
                sys.exit(1)
        else:
            StepUtility.printFail("Exiting Step - Failed to find transition id for transition name: " + current_environment.status)
            sys.exit(1)

        # Verbose: Print the list of viable transitions after the transition takes place
        if current_environment.verbose == "true":
            print()
            transition_list = jira.transitions(current_environment.issue)
            print("Viable transition statuses after:")
            for transition in transition_list:
                print("\t" + transition['id'], transition['name'])

    print("Successfully transitioned issue")
    # Issue was successfully transitioned - attempt to update the issue now if required
    if current_environment.action == "issue_transition_and_update":
        update_issue(jira, current_environment)


def update_issue(jira, current_environment):
    print("\nUpdate issue")
    issue = retrieve_jira_issue(jira, current_environment.issue)
    perform_jira_update(jira, current_environment, issue)


def update_multiple_issues(jira, current_environment):
    print("\nUpdate multiple issues from JQL query")
    issues_found = jql_query(jira, current_environment)
    for issue in issues_found:
        perform_jira_update(jira, current_environment, issue)


def perform_jira_update(jira, current_environment, issue):
    print("Updating issue: " + str(issue))
    update_issue_dict = {}
    if current_environment.issue_summary:
        update_issue_dict.update(summary = current_environment.issue_summary)
    if current_environment.issue_description:
        update_issue_dict.update(description = current_environment.issue_description)
    if current_environment.issue_type:
        update_issue_dict.update(issuetype = ast.literal_eval(current_environment.issue_type))
    if current_environment.issue_components:
        update_issue_dict.update(components = current_environment.issue_components)
    try:
        issue.update(update_issue_dict)
    except Exception as exc:
        StepUtility.printCleanException(exc)
        StepUtility.printFail("Exiting Step - Failed to update issue: " + str(issue))
        sys.exit(1)


def verify_issue_status(jira, current_environment):
    if current_environment.status:
        issues_to_verify = []
        # If they have a single issue listed, add it to be verified
        if current_environment.issue:
            issue = retrieve_jira_issue(jira, current_environment.issue)
            issues_to_verify.append(issue)
        # If they have a jql query specified, retrieve the list of issues to be verified
        if current_environment.jql_query:
            issues_to_verify.extend(jql_query(jira, current_environment))

        print("\nVerify issue transition status")
        print("Desired Status: " + str(current_environment.status))
        for current_issue in issues_to_verify:
            if str(current_issue.fields.status) == current_environment.status:
                print(str(current_issue) + ": " + str(current_issue.fields.status))
            else:
                StepUtility.printFail("Exiting Step - Jira Issue "
                    + str(current_issue)
                    + "\n Current Status: "
                    + str(current_issue.fields.status)
                    + "\n Desired status: "
                    + str(current_environment.status))
                sys.exit(1)
        print("Successfully verified status")
    else:
        StepUtility.printFail("Exiting Step - Please specify a valid status name")
        sys.exit(1)


def jql_query(jira, current_environment):
    print("\nQuerying for results")

    issues_found = []
    for issue in jira.search_issues(current_environment.jql_query, maxResults=current_environment.jql_query_max_results):
        print('{}: {}'.format(issue.key, issue.fields.summary))
        issues_found.append(issue)
    return issues_found


def retrieve_jira_issue(jira, current_issue):
    try:
        issue = jira.issue(current_issue)
        return issue
    except Exception as exc:
        StepUtility.printCleanException(exc)
        StepUtility.printFail("Exiting Step - Failed to retrieve issue")
        sys.exit(1)


def action_required(jira, current_environment):
    StepUtility.printFail("Exiting Step - Please specify a valid action type")
    sys.exit(1)


# Entrypoint for the application
if __name__ == "__main__":
    main()
