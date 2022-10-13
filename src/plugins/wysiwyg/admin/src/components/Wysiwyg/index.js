import React from "react";
import Editor from "../Editor";
import PropTypes from "prop-types";
import { Box } from "@strapi/design-system/Box";
import { Stack } from "@strapi/design-system/Stack";
import { useIntl } from "react-intl";
import { Typography } from "@strapi/design-system/Typography";

const Wysiwyg = ({
  name,
  onChange,
  value,
  intlLabel,
  error,
  description,
  required,
}) => {
  const { formatMessage } = useIntl();

  return (
    <>
      <Stack spacing={1}>
        <Box>
          <Typography variant="pi" fontWeight="bold">
            {formatMessage(intlLabel)}
          </Typography>
          {required && (
            <Typography variant="pi" fontWeight="bold" textColor="danger600">
              *
            </Typography>
          )}
        </Box>
        <Editor name={name} onChange={onChange} value={value} />
        {error && (
          <Typography variant="pi" textColor="danger600">
            {formatMessage({ id: error, defaultMessage: error })}
          </Typography>
        )}
        {description && (
          <Typography variant="pi">{formatMessage(description)}</Typography>
        )}
      </Stack>
    </>
  );
};

Wysiwyg.defaultProps = {
  description: "",
  disabled: false,
  error: undefined,
  intlLabel: "",
  required: false,
  value: "",
};

Wysiwyg.propTypes = {
  description: PropTypes.shape({
    id: PropTypes.string,
    defaultMessage: PropTypes.string,
  }),
  disabled: PropTypes.bool,
  error: PropTypes.string,
  intlLabel: PropTypes.shape({
    id: PropTypes.string,
    defaultMessage: PropTypes.string,
  }),
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool,
  value: PropTypes.string,
};

export default Wysiwyg;
